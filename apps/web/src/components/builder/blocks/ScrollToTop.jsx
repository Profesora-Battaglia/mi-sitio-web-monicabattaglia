import React, { useEffect, useState } from 'react';

const VISIBLE_AFTER_PX = 300;

export default function ScrollToTop({ scrollToTopStyle }) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => setIsVisible(window.scrollY > VISIBLE_AFTER_PX);

		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });

		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	const style = {
		'--scroll-to-top-background-color': scrollToTopStyle?.backgroundColor || undefined,
		'--scroll-to-top-icon-color': scrollToTopStyle?.iconColor || undefined,
	};

	const className = [
		'block-product-list__scroll-to-top',
		isVisible ? '' : 'block-product-list__scroll-to-top--hidden',
	].filter(Boolean).join(' ');

	return (
		<button
			type="button"
			className={className}
			style={style}
			aria-label="Volver arriba"
			onClick={() => window.scrollTo({
				top: 0,
				behavior: 'smooth',
			})}
		>
			<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
				<path d="M12 5l7 7-1.4 1.4L13 8.8V19h-2V8.8l-4.6 4.6L5 12z" fill="currentColor" />
			</svg>
		</button>
	);
}
