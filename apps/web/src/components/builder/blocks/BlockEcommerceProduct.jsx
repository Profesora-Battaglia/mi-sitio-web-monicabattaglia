import React, {
	useEffect,
	useMemo,
	useState,
} from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { getCheckoutCancelUrl, getCheckoutSuccessUrl, useEcommerceCart } from './EcommerceCart.jsx';
import {
	buildBookingCheckoutItem,
	getBookingCheckoutState,
	getClampedCarouselIndex,
	getFormattedBookingDuration,
	getProductImage,
	getProductImages,
	getVariantCurrency,
	getVariantCurrencyInfo,
	getVariantPriceAmount,
} from './ecommerceHelpers.js';
import { ProductCard } from './BlockEcommerceProductList.jsx';
import BookingSlotPicker, { getBookingTimeZone } from './BookingSlotPicker.jsx';
import ProductReviewAnalytics from './ProductReviewAnalytics.jsx';
import QuantityPicker from './QuantityPicker.jsx';
import { useProductDescriptionLayout } from './useProductDescriptionLayout.js';
import { productPlaceholderImage } from '@/data/ecommerce';

const RELATED_PRODUCTS_PER_PAGE = 4;
/** Sentinel category standing for the whole catalogue, which the products endpoint cannot filter by. */
const ALL_PRODUCTS_CATEGORY_ID = 'all-products';

function RelatedProducts({
	categoryId,
	title,
	imageRatio,
}) {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		let cancelled = false;

		if (!categoryId) {
			setProducts([]);

			return undefined;
		}

		const loadRelated = async () => {
			try {
				const api = await import('@/api/EcommerceApi.js');

				if (!api.getProducts) {
					return;
				}

				const collectionId = categoryId === ALL_PRODUCTS_CATEGORY_ID ? undefined : categoryId;
				const result = await api.getProducts({
					limit: RELATED_PRODUCTS_PER_PAGE,
					offset: 0,
					collection_ids: collectionId,
					sort: collectionId ? 'order=ASC&sort_by=collection_order' : undefined,
					exclude_types: 'subscription',
				});
				const list = (Array.isArray(result) ? result : result?.products) || [];

				if (!cancelled) {
					setProducts(list);
				}
			} catch (err) {
				console.warn('[BlockEcommerceProduct] failed to load related products', err);
			}
		};

		loadRelated();

		return () => {
			cancelled = true;
		};
	}, [categoryId]);

	if (!products.length) {
		return null;
	}

	return (
		<div className="block-product__related-products">
			{title ? (
				<h3 className="block-product-list__category show-title">{title}</h3>
			) : null}
			<div
				className="block-product-list__grid"
				style={{
					'--product-list-columns': String(RELATED_PRODUCTS_PER_PAGE),
					'--column-count': String(RELATED_PRODUCTS_PER_PAGE),
					'--product-list-gap': '24px',
				}}
			>
				{products.map((item) => (
					<ProductCard
						key={item.id}
						product={item}
						imageRatio={imageRatio}
						isCartVisible={false}
						isButtonEnabled
						isButtonFullWidth
					/>
				))}
			</div>
		</div>
	);
}

function ProductCarousel({
	product,
	title,
	imageRatio = 'contain',
	imageBorderRadius = 0,
	galleryPlacement = '',
}) {
	const [activeIndex, setActiveIndex] = useState(0);
	const urls = useMemo(() => {
		const images = getProductImages(product);

		return images.length ? images : [productPlaceholderImage].filter(Boolean);
	}, [product]);
	const clampedActiveIndex = getClampedCarouselIndex(activeIndex, urls.length);

	useEffect(() => {
		if (activeIndex !== clampedActiveIndex) {
			setActiveIndex(clampedActiveIndex);
		}
	}, [activeIndex, clampedActiveIndex]);

	const activeUrl = urls[clampedActiveIndex] || urls[0];
	const isGalleryLeft = galleryPlacement === 'left';
	const carouselClassName = [
		'product-carousel',
		isGalleryLeft ? 'product-carousel--left' : '',
	].filter(Boolean).join(' ');
	const imageWrapperClassName = [
		'product-carousel__image-wrapper',
		`product-carousel__image-wrapper--${imageRatio || 'contain'}${isGalleryLeft ? '-left' : ''}`,
	].join(' ');

	if (!activeUrl) {
		return (
			<div className={carouselClassName}>
				<div className="product-carousel__image-wrapper product-carousel__image-wrapper--empty" />
			</div>
		);
	}

	return (
		<div
			className={carouselClassName}
			style={{
				'--image-max-width': '600px',
				'--image-max-width-small': '64px',
				'--image-object-fit': imageRatio === 'cover' ? 'cover' : 'contain',
				'--image-border-radius': imageRatio === 'cover' ? imageBorderRadius : 0,
			}}
		>
			<div className={imageWrapperClassName}>
				<img
					className="product-carousel__image product-carousel__main-image ecommerce-product-image"
					src={activeUrl}
					alt={title || ''}
					loading="eager"
				/>
			</div>
			{urls.length > 1 ? (
				<ul className="product-carousel__thumbnails">
					{urls.map((url, index) => (
						<li key={`${url}-${index}`}>
							<button
								type="button"
								className={[
									'product-carousel__thumbnail',
									index === clampedActiveIndex ? 'product-carousel__thumbnail--active' : '',
								].filter(Boolean).join(' ')}
								onClick={() => setActiveIndex(index)}
							>
								<img src={url} alt="" />
							</button>
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
}

export default function BlockEcommerceProduct({
	blockId,
	productId,
	imageRatio = 'contain',
	imageBorderRadius = 0,
	galleryPlacement = '',
	isQuantityPickerEnabled = false,
	whatsAppNumber = '',
	whatsAppMessage = '',
	style = {},
}) {
	const params = useParams() || {};
	const slug = params.slug;
	const resolvedId = productId || params.id || params.productId;

	const [product, setProduct] = useState(null);
	const [error, setError] = useState(null);
	const [notFound, setNotFound] = useState(false);
	const [checkoutStatus, setCheckoutStatus] = useState('idle');
	const [quantity, setQuantity] = useState(1);
	const [selectedOptions, setSelectedOptions] = useState({});
	const [variantQuantities, setVariantQuantities] = useState(null);
	const [customFieldValues, setCustomFieldValues] = useState({});
	const [selectedSlot, setSelectedSlot] = useState('');
	const { addItem } = useEcommerceCart();

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				const api = await import('@/api/EcommerceApi.js');
				let result = null;

				if (slug && api.getProductBySlug) {
					result = await api.getProductBySlug(slug);
				} else if (resolvedId && api.getProduct) {
					result = await api.getProduct(resolvedId);
				} else if (api.getProducts) {
					const list = await api.getProducts({
						limit: 1,
						exclude_types: 'subscription',
					});
					result = list?.products?.[0] || null;
				}

				if (!cancelled) {
					if (!result) {
						setNotFound(true);
						setProduct(null);
					} else {
						setNotFound(false);
						setProduct(result);
					}
					setError(null);
				}
			} catch (err) {
				if (!cancelled) {
					const status = String(err?.message || '');
					if (status.includes('404')) {
						setNotFound(true);
					} else {
						setError(err);
					}
					console.warn('[BlockEcommerceProduct] failed to load product', err);
				}
			}
		}

		load();

		return () => {
			cancelled = true;
		};
	}, [slug, resolvedId]);

	useEffect(() => {
		let cancelled = false;

		const variants = product?.variants || [];

		if (!product?.id || !variants.some((item) => item.manage_inventory)) {
			setVariantQuantities(null);

			return undefined;
		}

		const loadQuantities = async () => {
			try {
				const api = await import('@/api/EcommerceApi.js');

				if (!api.getProductQuantities) {
					return;
				}

				const result = await api.getProductQuantities({
					fields: 'inventory_quantity',
					product_ids: [product.id],
				});

				if (!cancelled) {
					setVariantQuantities(Object.fromEntries(
						(result?.variants || []).map((item) => [item.id, item.inventory_quantity]),
					));
				}
			} catch (err) {
				console.warn('[BlockEcommerceProduct] failed to load stock', err);
			}
		};

		loadQuantities();

		return () => {
			cancelled = true;
		};
	}, [product]);

	const isVariantInStock = (item) => !item?.manage_inventory
		|| !variantQuantities
		|| (variantQuantities[item.id] ?? 0) > 0;

	const variant = useMemo(() => {
		const variants = product?.variants || [];
		const selections = Object.entries(selectedOptions);

		if (selections.length) {
			const matched = variants.find((item) => selections.every(
				([optionId, value]) => (item.options || []).some(
					(option) => String(option.option_id) === optionId && option.value === value,
				),
			));

			if (matched) {
				return matched;
			}
		}

		return variants.find(isVariantInStock) || variants[0];
	}, [product, selectedOptions, variantQuantities]);

	const price = variant?.sale_price_formatted
		|| variant?.price_formatted
		|| product?.price_formatted
		|| (product?.price_in_cents != null ? String(product.price_in_cents / 100) : '');
	// Vue shows the original struck through only when a sale price replaces it.
	const originalPrice = variant?.sale_price_formatted ? variant?.price_formatted : '';
	const stockQuantity = variant?.manage_inventory && variantQuantities
		? (variantQuantities[variant.id] ?? 0)
		: null;
	const isOutOfStock = Boolean(variant) && !isVariantInStock(variant);
	const isPurchasable = product?.purchasable !== false;
	const customFields = product?.custom_fields || [];
	const relatedCategory = product?.related_products?.[0];
	const whatsAppUrl = useMemo(() => {
		if (!product || !whatsAppNumber.trim()) {
			return '';
		}

		const prefix = whatsAppMessage || "Hola! Estoy interesado/a en comprar";
		const parts = [
			...(product.options || []).map((option) => {
				const chosen = (variant?.options || []).find((item) => String(item.option_id) === String(option.id));

				return chosen && option.title ? `${option.title.toLowerCase()}: ${chosen.value}` : null;
			}),
			...customFields
				.map((field) => {
					const value = customFieldValues[field.id ?? field.title];

					return value?.trim() ? `${field.title.toLowerCase()}: ${value}` : null;
				}),
		].filter(Boolean);
		const suffix = parts.length ? ` (${parts.join(', ')})` : '';
		const url = typeof window === 'undefined' ? '' : window.location.href;
		const message = `${prefix} ${product.title}${suffix}. ${url}`;

		return `https://wa.me/${whatsAppNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
	}, [product, variant, customFields, customFieldValues, whatsAppNumber, whatsAppMessage]);
	const isBooking = product?.type?.value === 'booking';
	const duration = isBooking ? getFormattedBookingDuration(product) : '';
	const location = variant?.booking_event?.location || '';
	const bookingEventId = variant?.booking_event?.id || '';
	const bookingTimeZone = useMemo(() => getBookingTimeZone(), []);
	const bookingState = isBooking
		? getBookingCheckoutState({ bookingEventId, selectedSlot })
		: null;
	const pageTitle = product?.seo_settings?.title || product?.title || 'Producto';
	const additionalInfo = useMemo(() => [...(product?.additional_info || [])].sort(
		(a, b) => (a.order || 0) - (b.order || 0),
	), [product]);
	const {
		layoutRef,
		galleryRef,
		contentRef,
		descriptionRef,
		additionalInfoRef,
	} = useProductDescriptionLayout({ additionalInfo, product });
	// Booking and digital products have no quantity to pick.
	const isQuantityPickerVisible = isQuantityPickerEnabled
		&& !!product
		&& !['booking', 'digital'].includes(product?.type?.value);

	const handleBuy = async () => {
		if (!product) {
			return;
		}

		const selectedCustomFields = customFields
			.map((field) => ({
				title: field.title,
				value: customFieldValues[field.id ?? field.title] || '',
			}))
			.filter((field) => field.value);

		if (!isBooking) {
			addItem({
				id: product.id,
				variant_id: variant?.id || product.id,
				variant_title: variant?.title || '',
				title: product.title,
				image: getProductImage(product),
				price_formatted: price,
				price_amount: getVariantPriceAmount(variant),
				currency: getVariantCurrency(variant),
							currency_info: getVariantCurrencyInfo(variant),
				type: product?.type?.value,
				quantity: isQuantityPickerVisible ? quantity : 1,
				custom_fields: selectedCustomFields,
			});
			return;
		}

		// A booking never enters the cart: checkout takes the one slot the visitor picked.
		if (bookingState !== 'ready') {
			return;
		}

		setCheckoutStatus('loading');
		try {
			const api = await import('@/api/EcommerceApi.js');
			const result = await api.initializeCheckout({
				items: [buildBookingCheckoutItem({
					variantId: variant?.id || product.id,
					timeSlot: selectedSlot,
					timeZone: bookingTimeZone,
					customFields: selectedCustomFields,
				})],
				successUrl: getCheckoutSuccessUrl([{ type: 'booking' }]),
				cancelUrl: getCheckoutCancelUrl(),
			});
			const checkoutUrl = result?.url || result?.checkout_url || result?.redirect_url;
			if (checkoutUrl && typeof window !== 'undefined') {
				window.location.assign(checkoutUrl);
				return;
			}
			setCheckoutStatus('success');
		} catch (err) {
			console.warn('[BlockEcommerceProduct] checkout failed', err);
			setCheckoutStatus('error');
		}
	};

	return (
		<section
			id={blockId}
			className="block"
			data-block-id={blockId}
			data-product-id={product?.id || resolvedId || undefined}
			style={style}
		>
			<div className="block-product-wrapper">
				{product ? (
					<Helmet>
						<title>{pageTitle}</title>
						{product.seo_settings?.description ? (
							<meta name="description" content={product.seo_settings.description} />
						) : null}
					</Helmet>
				) : null}

				{notFound ? <p className="block-product__empty">Producto no encontrado</p> : null}
				{error ? <p className="block-product__empty">Producto no disponible</p> : null}

				{product ? (
					<div className="block-product">
						<div
							ref={layoutRef}
							className="block-product__main-info product-content-layout"
						>
							<div className="block-product__image-content-wrapper">
								<div
									ref={galleryRef}
									className="product-content-layout__gallery"
								>
									<ProductCarousel
										product={product}
										title={product.title}
										imageRatio={imageRatio}
										galleryPlacement={galleryPlacement}
									/>
								</div>
							</div>
							<div
								ref={contentRef}
								className="block-product__content-wrapper"
							>
								<div className="block-product__price-data-wrapper">
									<h1 className="block-product__title">{product.title}</h1>
									{product.reviews_analytics?.average_rating ? (
										<div className="block-product__rating-below-title">
											<span className="block-product__rating" aria-hidden="true">
												{'★★★★★'.slice(0, Math.round(product.reviews_analytics.average_rating))}
											</span>
											<p className="block-product__rating-count">
												{`(${product.reviews_analytics.total_reviews || 0})`}
											</p>
										</div>
									) : null}
									{product.subtitle ? (
										<h2 className="block-product__subtitle">{product.subtitle}</h2>
									) : null}
									<p className={[
										'block-product__price-wrapper',
										duration ? 'block-product__price-wrapper--with-duration' : '',
									].filter(Boolean).join(' ')}>
										{originalPrice ? (
											<span className="block-product__price block-product__price--sale body-large">
												{originalPrice}
											</span>
										) : null}
										{price ? (
											<span className="block-product__price body-large">{price}</span>
										) : null}
										{duration ? (
											<span className="block-product__duration body-large">{duration}</span>
										) : null}
									</p>
									{location ? (
										<p className="block-product__location">{location}</p>
									) : null}
								</div>
								{(product.options || []).length ? (
									<div className="block-product__options">
										{product.options.map((option) => (
											<label key={option.id} className="block-product__option">
												<span>{option.title}</span>
												<select
													value={selectedOptions[String(option.id)] || ''}
													onChange={(event) => setSelectedOptions((current) => ({
														...current,
														[String(option.id)]: event.target.value,
													}))}
												>
													<option value="">Seleccionar {option.title}</option>
													{(option.values || []).map((value) => (
														<option key={value.id || value.value} value={value.value}>
															{value.value}
														</option>
													))}
												</select>
											</label>
										))}
									</div>
								) : null}
								{customFields.length ? (
									<div className="block-product__input-field-wrapper">
										{customFields.map((field) => (
											<label key={field.id || field.title} className="block-product__input-field">
												<span>{field.title}</span>
												<input
													value={customFieldValues[field.id ?? field.title] || ''}
													required={field.is_required}
													onChange={(event) => setCustomFieldValues((current) => ({
														...current,
														[field.id ?? field.title]: event.target.value,
													}))}
												/>
											</label>
										))}
									</div>
								) : null}
								{isQuantityPickerVisible ? (
									<div className={[
										'block-product__quantity-wrapper',
										isOutOfStock ? 'block-product__quantity-wrapper--disabled' : '',
									].filter(Boolean).join(' ')}>
										<QuantityPicker
											quantity={quantity}
											isStockAvailable={!isOutOfStock}
											isLimitReached={stockQuantity != null && quantity >= stockQuantity}
											onChange={(next) => setQuantity(Math.max(1, next))}
										/>
										{stockQuantity != null && stockQuantity > 0 ? (
											<p className="block-product__stock-text">{`${stockQuantity} en stock`}</p>
										) : null}
									</div>
								) : null}
								{isBooking ? (
									<BookingSlotPicker
										bookingEventId={bookingEventId}
										timeZone={bookingTimeZone}
										selectedSlot={selectedSlot}
										onSelectSlot={setSelectedSlot}
									/>
								) : null}
								<div className="block-product__button-wrapper">
									<div className={[
										'block-product__primary-buttons',
										whatsAppUrl ? 'block-product__primary-buttons--with-whatsapp' : '',
									].filter(Boolean).join(' ')}>
										{bookingState === 'unavailable' ? (
											<p className="block-product__booking-status">
												Este turno no se puede reservar online.
											</p>
										) : null}
										{isPurchasable && bookingState !== 'unavailable' ? (
											<button
												type="button"
												className="grid-button grid-button--primary block-product__button block-product__button--primary"
												disabled={checkoutStatus === 'loading' || isOutOfStock || bookingState === 'awaitingSlot'}
												onClick={handleBuy}
											>
												{checkoutStatus === 'loading' ? 'Iniciando pago…' : null}
												{checkoutStatus !== 'loading' && isOutOfStock ? 'Sin stock' : null}
												{checkoutStatus !== 'loading' && !isOutOfStock && isBooking
													? (bookingState === 'ready' ? 'Reservar' : 'Elegí un horario')
													: null}
												{checkoutStatus !== 'loading' && !isOutOfStock && !isBooking
													? 'Agregar al carrito'
													: null}
											</button>
										) : null}
										{whatsAppUrl ? (
											<a
												className="grid-button block-product__button block-product__button--whatsapp"
												href={whatsAppUrl}
												target="_blank"
												rel="noopener noreferrer"
											>
												Chatear por WhatsApp
											</a>
										) : null}
									</div>
									{checkoutStatus === 'error' ? (
										<p className="block-product__checkout-error">No se pudo completar la compra. Intentá de nuevo.</p>
									) : null}
								</div>
								{product.description ? (
									<div
										ref={descriptionRef}
										className="block-product__description product-content-layout__description"
										dangerouslySetInnerHTML={{
											__html: product.description,
										}}
									/>
								) : null}
								{additionalInfo.length ? (
									<div
										ref={additionalInfoRef}
										className="block-product__additional-info"
									>
										{additionalInfo.map((info) => (
											<details key={info.id || info.title} className="block-product__additional-info-item">
												<summary>{info.title}</summary>
												<div dangerouslySetInnerHTML={{
													__html: info.description || '',
												}}
												/>
											</details>
										))}
									</div>
								) : null}
							</div>
						</div>
						<RelatedProducts
							categoryId={relatedCategory?.related_id}
							title={relatedCategory?.section_title}
							imageRatio={imageRatio}
						/>
						{product.reviews_analytics?.total_reviews ? (
							<>
								<h3 className="block-product__reviews-title">Reseñas</h3>
								<div className="block-product__reviews">
									<ProductReviewAnalytics analytics={product.reviews_analytics} />
								</div>
							</>
						) : null}
					</div>
				) : (
					!error && !notFound ? <p className="block-product__empty">Cargando producto…</p> : null
				)}
			</div>
		</section>
	);
}
