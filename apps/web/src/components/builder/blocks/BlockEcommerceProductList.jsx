import React, {
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import SmartLink from '../SmartLink.jsx';
import { useEcommerceCart } from './EcommerceCart.jsx';
import ProductSortDropdown from './ProductSortDropdown.jsx';
import ProductListPagination from './ProductListPagination.jsx';
import ProductListEmptyState from './ProductListEmptyState.jsx';
import CategoryList from './CategoryList.jsx';
import ScrollToTop from './ScrollToTop.jsx';
import {
	applyProductListFetchResult,
	getFormattedBookingDuration,
	getProductImage,
	getProductImages,
	getProductListViewState,
	getProductPageHref,
	getVariantCurrency,
	getVariantCurrencyInfo,
	getVariantPriceAmount,
	PRODUCT_LIST_VIEW_STATE,
} from './ecommerceHelpers.js';
import { productPlaceholderImage } from '@/data/ecommerce';

function getAddButtonText(product, buttonText, isCartVisible) {
	if (buttonText) {
		return buttonText;
	}

	if (product?.type?.value === 'booking') {
		return 'Reservar';
	}

	if (product?.type?.value === 'digital' && !product?.price_in_cents && !isCartVisible) {
		return 'Descargar';
	}

	return 'Agregar al carrito';
}

function getRibbonStyle(ribbonStyle) {
	return Object.fromEntries(
		Object.entries(ribbonStyle || {}).map(([key, value]) => [`--${key}`, value]),
	);
}

export function ProductCard({
	product,
	imageRatio = 'portrait',
	imageBorderRadius,
	listItemStyle = 'left',
	imageHoverEffect = 'none',
	isCartVisible,
	isButtonEnabled = true,
	buttonText,
	buttonType = 'primary',
	buttonBorderWidth,
	isButtonFullWidth = false,
	ribbonStyle,
	variantQuantities,
	onAdd,
}) {
	const href = getProductPageHref(product);
	const variants = product?.variants || [];
	const isVariantInStock = (item) => !item?.manage_inventory
		|| !variantQuantities
		|| (variantQuantities[item.id] ?? 0) > 0;
	const variant = variants.find(isVariantInStock) || variants[0];
	const isStockTracked = variants.length > 0 && variants.every((item) => item.manage_inventory);
	const isSoldOut = isStockTracked
		&& Boolean(variantQuantities)
		&& variants.every((item) => (variantQuantities[item.id] ?? 0) <= 0);
	const isPurchasable = product?.purchasable !== false;
	// A range is offered only when the store sorts by lowest price and the variants differ.
	const isPriceRangeShown = product?.site_product_selection === 'lowest_price_first'
		&& new Set(variants.map(getVariantPriceAmount)).size > 1;
	const priceVariant = isPriceRangeShown
		? variants.reduce((lowest, item) => (
			(getVariantPriceAmount(item) ?? Infinity) < (getVariantPriceAmount(lowest) ?? Infinity) ? item : lowest
		), variants[0])
		: variants[0];
	const price = priceVariant?.sale_price_formatted
		|| priceVariant?.price_formatted
		|| product?.price_formatted
		|| (product?.price_in_cents != null ? String(product.price_in_cents / 100) : '');
	const originalPrice = priceVariant?.sale_price_formatted ? priceVariant?.price_formatted : '';
	const rating = product?.reviews_analytics?.average_rating;
	const reviewCount = product?.reviews_analytics?.total_reviews;
	const primaryImage = getProductImage(product) || productPlaceholderImage;
	const secondaryImage = getProductImages(product)[1];
	const isBooking = product?.type?.value === 'booking';
	const duration = isBooking ? getFormattedBookingDuration(product) : '';
	const addButtonText = getAddButtonText(product, buttonText, isCartVisible);
	const addButtonClassName = [
		'grid-button',
		`grid-button--${buttonType === 'secondary' ? 'secondary' : 'primary'}`,
		'block-product-list__add',
		isButtonFullWidth ? 'block-product-list__add--full-width' : '',
	].filter(Boolean).join(' ');
	const addButtonStyle = {
		'--border-width': buttonBorderWidth === 0 || buttonBorderWidth
			? `${buttonBorderWidth}px`
			: '0px',
	};

	const media = (
		<div
			className={[
				'block-product-list__image-wrap',
				`block-product-list__image-wrap--${imageRatio || 'portrait'}`,
				imageHoverEffect === 'zoom' ? 'block-product-list__image-wrap--zoom' : '',
			].filter(Boolean).join(' ')}
			style={{
				'--image-border-radius': imageRatio === 'contain' ? '0%' : imageBorderRadius,
				'--image-object-fit': imageRatio === 'contain' ? 'contain' : 'cover',
			}}
		>
			{primaryImage ? (
				<img
					src={primaryImage}
					alt={product.title || ''}
					loading="lazy"
					className="block-product-list__image"
				/>
			) : (
				<div className="block-product-list__image-placeholder" />
			)}
			{imageHoverEffect === 'swap-image' && secondaryImage ? (
				<img
					src={secondaryImage}
					alt=""
					loading="lazy"
					className="block-product-list__image block-product-list__image--secondary"
				/>
			) : null}
		</div>
	);

	const ribbon = product?.ribbon_text ? (
		<div className="ecommerce-product-ribbon" style={getRibbonStyle(ribbonStyle)}>
			<p className="ecommerce-product-ribbon__text">{product.ribbon_text}</p>
		</div>
	) : null;

	const meta = (
		<>
			<h6 className="block-product-list__title">{product?.title || 'Producto'}</h6>
			{rating ? (
				<span className="block-product-list__rating">
					<span className="block-product-list__rating-stars" aria-hidden="true">
						{'★★★★★'.slice(0, Math.round(rating))}
					</span>
					{reviewCount ? ` (${reviewCount})` : ''}
				</span>
			) : null}
			{isSoldOut ? (
				<span className="block-product-list__sold-out">Agotado</span>
			) : null}
			{(price || duration) ? (
				<p className="block-product-list__price-wrapper">
					{isPriceRangeShown ? 'Desde ' : ''}
					{originalPrice ? (
						<span className="block-product-list__price--old">{originalPrice}</span>
					) : null}
					<span className="block-product-list__price">{price}</span>
					{price && duration ? (
						<span className="block-product-list__duration">{duration}</span>
					) : null}
					{!price && duration ? duration : ''}
				</p>
			) : null}
		</>
	);

	const content = (
		<>
			{ribbon}
			{media}
			<div className="product-list-item__details">{meta}</div>
		</>
	);

	return (
		<article className={[
			'block-product-list__card',
			'product-list-item',
			`product-list-item--${listItemStyle}`,
		].join(' ')}>
			{href ? (
				<SmartLink href={href} className="block-product-list__card-link product-list__link">
					{content}
				</SmartLink>
			) : (
				<div className="block-product-list__card-link">
					{content}
				</div>
			)}
			{isButtonEnabled && isPurchasable && !isSoldOut ? (
				<div className="product-list-item__button-wrapper">
					{isCartVisible && !isBooking ? (
						<button
							type="button"
							className={addButtonClassName}
							style={addButtonStyle}
							onClick={() => onAdd?.(product, variant)}
						>
							{addButtonText}
						</button>
					) : (
						href ? (
							<SmartLink
								href={href}
								className={`${addButtonClassName} block-product-list__add--link`}
								style={addButtonStyle}
							>
								{addButtonText}
							</SmartLink>
						) : null
					)}
				</div>
			) : null}
		</article>
	);
}

function readPageFromUrl(blockId) {
	if (typeof window === 'undefined') {
		return 1;
	}
	const params = new URLSearchParams(window.location.search);
	const raw = params.get(`store-page-${blockId}`) || '1';
	const page = Number.parseInt(raw, 10);
	return Number.isFinite(page) && page > 0 ? page : 1;
}

function writePageToUrl(blockId, page) {
	if (typeof window === 'undefined') {
		return;
	}
	const url = new URL(window.location.href);
	const key = `store-page-${blockId}`;
	if (page <= 1) {
		url.searchParams.delete(key);
	} else {
		url.searchParams.set(key, String(page));
	}
	window.history.pushState({}, '', url.toString());
}

function readCategoryFromUrl() {
	if (typeof window === 'undefined') {
		return '';
	}

	return new URLSearchParams(window.location.search).get('category') || '';
}

function writeCategoryToUrl(categoryId) {
	if (typeof window === 'undefined') {
		return;
	}

	const url = new URL(window.location.href);

	if (categoryId) {
		url.searchParams.set('category', categoryId);
	} else {
		url.searchParams.delete('category');
	}

	window.history.pushState({}, '', url.toString());
}

export default function BlockEcommerceProductList({
	blockId,
	limit = 12,
	productIds,
	productCategoryId,
	productType,
	columnCount = 4,
	columnGap = 24,
	imageRatio = 'portrait',
	imageBorderRadius,
	listItemStyle = 'left',
	imageHoverEffect = 'none',
	productSorting,
	scrollBehaviour = 'pagination',
	isTotalProductCountShown = false,
	isButtonEnabled = true,
	buttonText,
	buttonDisplay,
	buttonType = 'primary',
	buttonBorderWidth,
	isButtonFullWidth = false,
	isFullWidth = false,
	isListCentered = false,
	isCategoryListEnabled = false,
	disabledFilterCategoryIds,
	isScrollToTopEnabled = false,
	scrollToTopStyle,
	ribbonStyle,
	style = {},
}) {
	const sectionRef = useRef(null);
	const [products, setProducts] = useState([]);
	const [variantQuantities, setVariantQuantities] = useState(null);
	const [totalCount, setTotalCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(() => readPageFromUrl(blockId));
	const [sort, setSort] = useState(() => {
		if (!productSorting?.enabled) {
			return '';
		}
		const firstEnabled = (productSorting.sortingOptions || []).find((option) => option.isEnabled !== false);
		return firstEnabled?.value ?? '';
	});
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [activeCategoryId, setActiveCategoryId] = useState(
		() => readCategoryFromUrl() || productCategoryId || '',
	);
	const [categories, setCategories] = useState([]);
	const [areCategoriesLoaded, setAreCategoriesLoaded] = useState(false);
	const { addItem } = useEcommerceCart();
	const productIdsKey = Array.isArray(productIds)
		? productIds.join(',')
		: String(productIds || '');

	const pageCount = useMemo(
		() => Math.max(1, Math.ceil(totalCount / (limit || 1))),
		[totalCount, limit],
	);

	const isSortingShown = Boolean(
		productSorting?.enabled && (productSorting.sortingOptions || []).length,
	);

	const resolvedSort = useMemo(() => {
		if (!sort && activeCategoryId) {
			return 'order=ASC&sort_by=collection_order';
		}
		return sort || '';
	}, [sort, activeCategoryId]);

	useEffect(() => {
		let cancelled = false;

		const loadProducts = async () => {
			setIsLoading(true);
			try {
				const api = await import('@/api/EcommerceApi.js');
				if (!api.getProducts) {
					return;
				}
				const result = await api.getProducts({
					limit,
					offset: (currentPage - 1) * limit,
					ids: productIds,
					collection_ids: activeCategoryId || undefined,
					type: productType || undefined,
					sort: resolvedSort || undefined,
					exclude_types: 'subscription',
				});
				applyProductListFetchResult({
					cancelled,
					result,
					setProducts,
					setTotalCount,
					setError,
					setIsLoading,
				});
			} catch (err) {
				applyProductListFetchResult({
					cancelled,
					error: err,
					setProducts,
					setTotalCount,
					setError,
					setIsLoading,
				});
				if (!cancelled) {
					console.warn('[BlockEcommerceProductList] failed to load products', err);
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false);
				}
			}
		};

		loadProducts();

		return () => {
			cancelled = true;
		};
	}, [currentPage, resolvedSort, limit, productIds, activeCategoryId, productType, productIdsKey]);

	useEffect(() => {
		const onPopState = () => {
			const pageFromUrl = readPageFromUrl(blockId);
			setCurrentPage((current) => (current === pageFromUrl ? current : pageFromUrl));
		};
		window.addEventListener('popstate', onPopState);
		return () => window.removeEventListener('popstate', onPopState);
	}, [blockId]);

	const handlePageChange = (page) => {
		setCurrentPage(page);
		writePageToUrl(blockId, page);
	};

	const handleSortChange = (nextSort) => {
		setSort(nextSort);
	};

	const sectionStyle = {
		...style,
		'--product-list-columns': String(columnCount),
		'--column-count': String(columnCount),
		'--product-list-gap': typeof columnGap === 'number' ? `${columnGap}px` : (columnGap || '24px'),
	};

	const productCountText = totalCount > 1
		? `${totalCount} productos`
		: `${totalCount} producto`;

	useEffect(() => {
		let cancelled = false;

		const tracked = products.filter((product) => (product.variants || []).some((item) => item.manage_inventory));

		if (!tracked.length) {
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
					product_ids: tracked.map((product) => product.id),
				});

				if (!cancelled) {
					setVariantQuantities(Object.fromEntries(
						(result?.variants || []).map((item) => [item.id, item.inventory_quantity]),
					));
				}
			} catch (err) {
				console.warn('[BlockEcommerceProductList] failed to load stock', err);
			}
		};

		loadQuantities();

		return () => {
			cancelled = true;
		};
	}, [products]);

	useEffect(() => {
		let cancelled = false;

		if (!isCategoryListEnabled) {
			return undefined;
		}

		const loadCategories = async () => {
			try {
				const api = await import('@/api/EcommerceApi.js');

				if (!api.getCategories) {
					return;
				}

				const result = await api.getCategories();

				if (!cancelled) {
					setCategories(Array.isArray(result) ? result : (result?.categories || []));
				}
			} catch (err) {
				console.warn('[BlockEcommerceProductList] failed to load categories', err);
			} finally {
				if (!cancelled) {
					setAreCategoriesLoaded(true);
				}
			}
		};

		loadCategories();

		return () => {
			cancelled = true;
		};
	}, [isCategoryListEnabled]);

	const visibleCategories = categories.filter(
		(category) => !(disabledFilterCategoryIds || []).includes(category.id),
	);
	const currentCategoryTitle = visibleCategories.find(
		(category) => category.id === activeCategoryId,
	)?.title || 'Todos los productos';

	const sectionClassName = [
		'block',
		'block-ecommerce-product-list',
		'block-product-list',
		isCategoryListEnabled ? 'block-product-list--with-categories' : '',
	].filter(Boolean).join(' ');

	const wrapperClassName = [
		'block-product-list__inner',
		'block-product-list__wrapper',
		isFullWidth ? 'block-product-list__wrapper--full-width' : '',
	].filter(Boolean).join(' ');

	const gridClassName = [
		'block-product-list__grid',
		'product-list__content',
		isListCentered && products.length === 1 ? 'block-product-list__grid--centered' : '',
	].filter(Boolean).join(' ');

	const viewState = getProductListViewState({
		isLoading,
		error,
		productCount: products.length,
	});
	const isListShown = viewState === PRODUCT_LIST_VIEW_STATE.LIST;
	const isHeaderShown = isListShown && (isTotalProductCountShown || isSortingShown);

	return (
		<section
			ref={sectionRef}
			id={blockId}
			className={sectionClassName}
			data-block-id={blockId}
			data-scroll-behaviour={scrollBehaviour}
			style={sectionStyle}
		>
			{isScrollToTopEnabled ? <ScrollToTop scrollToTopStyle={scrollToTopStyle} /> : null}
			<div className={wrapperClassName}>
				{isCategoryListEnabled && areCategoriesLoaded ? (
					<CategoryList
						blockId={blockId}
						categories={visibleCategories}
						currentCategoryId={activeCategoryId}
						onCategoryChange={(categoryId) => {
							setActiveCategoryId(categoryId);
							setCurrentPage(1);
							writeCategoryToUrl(categoryId);
						}}
					/>
				) : null}
				<div className="block-product-list__content-container">
					{isCategoryListEnabled && areCategoriesLoaded ? (
						<h3 className="block-product-list__category">{currentCategoryTitle}</h3>
					) : null}
					{isHeaderShown ? (
						<div className="product-list__header">
							<div className="product-list__header-item">
								{isTotalProductCountShown ? (
									<p className="product-list__total-count">{productCountText}</p>
								) : null}
								{isSortingShown ? (
									<ProductSortDropdown
										blockId={blockId}
										productSorting={productSorting}
										sorting={sort}
										onSortChange={handleSortChange}
									/>
								) : null}
							</div>
						</div>
					) : null}

					{isListShown ? (
						<ul className={gridClassName}>
							{products.map((product) => (
								<li key={product.id}>
									<ProductCard
										product={product}
										imageRatio={imageRatio}
										imageBorderRadius={imageBorderRadius}
										listItemStyle={listItemStyle}
										imageHoverEffect={imageHoverEffect}
										isCartVisible
										isButtonEnabled={isButtonEnabled}
										buttonText={buttonText}
										buttonDisplay={buttonDisplay}
										buttonType={buttonType}
										buttonBorderWidth={buttonBorderWidth}
										isButtonFullWidth={isButtonFullWidth}
										ribbonStyle={ribbonStyle}
										variantQuantities={variantQuantities}
										onAdd={(prod, variant) => {
											addItem({
												id: prod.id,
												variant_id: variant?.id || prod.id,
												variant_title: variant?.title || '',
												title: prod.title,
												image: getProductImage(prod),
												price_amount: getVariantPriceAmount(variant),
												currency: getVariantCurrency(variant),
												currency_info: getVariantCurrencyInfo(variant),
												price_formatted: variant?.sale_price_formatted
													|| variant?.price_formatted
													|| prod.price_formatted,
												type: prod?.type?.value,
												quantity: 1,
											});
										}}
									/>
								</li>
							))}
						</ul>
					) : (
						<div className="block-product-list__status">
							{viewState === PRODUCT_LIST_VIEW_STATE.ERROR ? <p>Productos no disponibles</p> : null}
							{viewState === PRODUCT_LIST_VIEW_STATE.LOADING ? <p>Cargando productos…</p> : null}
							{viewState === PRODUCT_LIST_VIEW_STATE.EMPTY ? <ProductListEmptyState /> : null}
						</div>
					)}

					{(isListShown || pageCount > 1) && scrollBehaviour !== 'scroll' ? (
						<ProductListPagination
							currentPage={currentPage}
							pageCount={pageCount}
							onPageChange={handlePageChange}
							scrollTargetRef={sectionRef}
						/>
					) : null}
				</div>
			</div>
		</section>
	);
}
