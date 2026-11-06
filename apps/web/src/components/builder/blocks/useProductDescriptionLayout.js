import { useEffect, useRef } from 'react';
import { getProductDescriptionLayout, getProductImages } from './ecommerceHelpers.js';

function getInitialAdditionalInfoHeight(element) {
	const details = Array.from(element.querySelectorAll('details'));
	const openStates = details.map((detail) => detail.open);
	const marginTop = Number.parseFloat(getComputedStyle(element).marginTop) || 0;

	details.forEach((detail, index) => {
		detail.open = index === 0;
	});

	try {
		return element.offsetHeight + marginTop;
	} finally {
		details.forEach((detail, index) => {
			detail.open = openStates[index];
		});
	}
}

export function useProductDescriptionLayout({ additionalInfo, product }) {
	const layoutRef = useRef(null);
	const galleryRef = useRef(null);
	const contentRef = useRef(null);
	const descriptionRef = useRef(null);
	const additionalInfoRef = useRef(null);

	useEffect(() => {
		const layout = layoutRef.current;
		const gallery = galleryRef.current;
		const content = contentRef.current;
		const description = descriptionRef.current;
		const additionalInfoElement = additionalInfoRef.current;
		let animationFrame;
		let resizeObserver;

		if (!layout) {
			return undefined;
		}

		const measure = () => {
			const descriptionMargin = description
				? Number.parseFloat(getComputedStyle(description).marginTop) || 0
				: 0;

			layout.classList.remove('product-content-layout--description-below-image');

			if (!gallery || !content || !description || !additionalInfoElement || !layout.offsetWidth) {
				return;
			}

			const descriptionLayout = getProductDescriptionLayout({
				isEnabled: Boolean(product?.description && additionalInfo.length && getProductImages(product).length),
				isDesktop: getComputedStyle(layout).flexDirection !== 'column',
				galleryHeight: gallery.offsetHeight,
				galleryWidth: gallery.offsetWidth,
				descriptionTop: description.offsetTop,
				descriptionHeight: description.offsetHeight,
				additionalInfoHeight: getInitialAdditionalInfoHeight(additionalInfoElement),
			});

			if (!descriptionLayout) {
				return;
			}

			layout.classList.add('product-content-layout--description-below-image');
			layout.style.setProperty('--product-gallery-height', `${descriptionLayout.galleryHeight}px`);
			layout.style.setProperty('--product-description-width', `${descriptionLayout.descriptionWidth}px`);
			layout.style.setProperty(
				'--product-content-min-height',
				`${descriptionLayout.galleryHeight + descriptionMargin + description.offsetHeight}px`,
			);
		};
		const scheduleMeasurement = () => {
			if (animationFrame !== undefined) {
				return;
			}

			animationFrame = requestAnimationFrame(() => {
				animationFrame = undefined;
				measure();
			});
		};
		const fontSet = typeof document === 'undefined' ? undefined : document.fonts;

		if (typeof ResizeObserver === 'undefined') {
			window.addEventListener('resize', scheduleMeasurement);
		} else {
			resizeObserver = new ResizeObserver(scheduleMeasurement);
			[layout, gallery, content, description, additionalInfoElement].forEach((element) => {
				if (element) {
					resizeObserver.observe(element);
				}
			});
		}

		layout.addEventListener('load', scheduleMeasurement, true);
		fontSet?.addEventListener('loadingdone', scheduleMeasurement);
		scheduleMeasurement();

		return () => {
			if (animationFrame !== undefined) {
				cancelAnimationFrame(animationFrame);
			}
			resizeObserver?.disconnect();
			window.removeEventListener('resize', scheduleMeasurement);
			layout.removeEventListener('load', scheduleMeasurement, true);
			fontSet?.removeEventListener('loadingdone', scheduleMeasurement);
		};
	}, [additionalInfo, product]);

	return {
		layoutRef,
		galleryRef,
		contentRef,
		descriptionRef,
		additionalInfoRef,
	};
}
