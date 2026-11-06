function roundNumberToTwoDecimals(value) {
	return Math.round(value * 100) / 100;
}

/**
 * Format booking duration from variant.booking_event (length in ms).
 * Matches site-modules getFormattedBookingDuration.
 */
export function getFormattedBookingDuration(product, translations = {}) {
	const bookingEvent = product?.variants?.[0]?.booking_event;
	if (!bookingEvent?.length) {
		return '';
	}

	const hourShort = translations.hourShort || 'h';
	const minuteShort = translations.minuteShort || 'min';
	const length = Number(bookingEvent.length) || 0;

	if (bookingEvent.length_unit === 'hours') {
		return `${roundNumberToTwoDecimals(length / 1000 / 60 / 60)} ${hourShort}`;
	}

	return `${roundNumberToTwoDecimals(length / 1000 / 60)} ${minuteShort}`;
}

/** EcommerceApi flattens the product thumbnail to `image` and normalises the gallery to `images`. */
export function getProductImages(product) {
	return (product?.images || []).map((image) => image?.url).filter(Boolean);
}

export function getProductImage(product) {
	return product?.variants?.[0]?.image_url || product?.image || '';
}

export function getClampedCarouselIndex(index, itemCount) {
	return Math.min(Math.max(index, 0), Math.max(itemCount - 1, 0));
}

export function getProductDescriptionLayout({
	isEnabled,
	isDesktop,
	galleryHeight,
	galleryWidth,
	descriptionTop,
	descriptionHeight,
	additionalInfoHeight,
}) {
	if (!isEnabled || !isDesktop || !galleryHeight || !galleryWidth
		|| descriptionTop + descriptionHeight + additionalInfoHeight <= galleryHeight) {
		return null;
	}

	return {
		galleryHeight,
		descriptionWidth: galleryWidth,
	};
}

/** Minor-unit price of a variant, sale price winning, for cart arithmetic. */
export function getVariantPriceAmount(variant) {
	if (!variant) {
		return undefined;
	}

	return variant.sale_price_in_cents ?? variant.price_in_cents;
}

export function getVariantCurrency(variant) {
	return variant?.currency;
}

/** Symbol, template and decimal digits, needed to format a total the API has not pre-formatted. */
export function getVariantCurrencyInfo(variant) {
	return variant?.currency_info;
}

export function getProductPageHref(product) {
	const slug = product?.seo_settings?.slug;
	if (!slug) {
		return null;
	}
	return `/${String(slug).replace(/^\//, '')}`;
}

export const PRODUCT_LIST_VIEW_STATE = {
	ERROR: 'error',
	LIST: 'list',
	LOADING: 'loading',
	EMPTY: 'empty',
};

export function getProductListViewState({ isLoading, error, productCount }) {
	if (productCount) {
		return PRODUCT_LIST_VIEW_STATE.LIST;
	}

	if (error) {
		return PRODUCT_LIST_VIEW_STATE.ERROR;
	}

	if (isLoading) {
		return PRODUCT_LIST_VIEW_STATE.LOADING;
	}

	return PRODUCT_LIST_VIEW_STATE.EMPTY;
}

export function applyProductListFetchResult({
	cancelled,
	result,
	error,
	setProducts,
	setTotalCount,
	setError,
	setIsLoading,
}) {
	if (cancelled) {
		return false;
	}

	if (error) {
		setError(error);
		setIsLoading(false);
		return true;
	}

	setProducts(result?.products || []);
	setTotalCount(Number(result?.count) || 0);
	setError(null);
	setIsLoading(false);
	return true;
}

/**
 * A booking only offers slots when its variant exposes a booking event, and only reaches
 * checkout once one is picked.
 */
export function getBookingCheckoutState({ bookingEventId, selectedSlot }) {
	if (!bookingEventId) {
		return 'unavailable';
	}

	if (!selectedSlot) {
		return 'awaitingSlot';
	}

	return 'ready';
}

/**
 * Checkout rejects a booking item that carries no `time_slot`/`time_zone`, and takes
 * exactly one appointment at quantity 1.
 */
export function buildBookingCheckoutItem({
	variantId,
	timeSlot,
	timeZone,
	customFields = [],
}) {
	return {
		variant_id: variantId,
		quantity: 1,
		time_slot: timeSlot,
		time_zone: timeZone,
		...(customFields.length ? { customFieldValues: customFields } : {}),
	};
}
