import React, { useEffect, useState } from 'react';
import { useEcommerceCart } from './EcommerceCart.jsx';

export const OPEN_MODAL_QUERY_PARAM = 'open-modal';
export const PRODUCT_QUERY_PARAM = 'product';
export const CHECKOUT_SUCCESS_MODAL_NAME = 'EcommerceCheckoutSuccess';

const MODAL_QUERY_PARAMS = [OPEN_MODAL_QUERY_PARAM, PRODUCT_QUERY_PARAM, 'leave-products', 'booking-id', 'order-token'];

const MODAL_CONTENT = {
	default: {
		title: 'Gracias por tu pedido',
		text: 'Tu pedido fue recibido.',
		buttonText: 'Entendido',
	},
	donation: {
		title: 'Gracias por tu donación',
		text: 'Tu donación fue recibida.',
		buttonText: 'Entendido',
	},
	digital: {
		title: 'Gracias por tu pedido',
		text: 'Revisá tu correo para descargar el producto digital. El email se envía cuando se completa el pago.',
		buttonText: 'Entendido',
	},
	booking: {
		title: '¡Gracias!',
		text: 'Email de confirmación enviado',
		buttonText: 'Listo',
	},
};

function stripModalQueryParams() {
	const params = new URLSearchParams(window.location.search);

	if (!MODAL_QUERY_PARAMS.some((param) => params.has(param))) {
		return;
	}

	MODAL_QUERY_PARAMS.forEach((param) => params.delete(param));
	const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
	window.history.pushState({}, '', newUrl);
}

export default function EcommerceCheckoutSuccess() {
	const { clearCart } = useEcommerceCart();
	const [content, setContent] = useState(null);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);

		if (params.get(OPEN_MODAL_QUERY_PARAM) !== CHECKOUT_SUCCESS_MODAL_NAME) {
			return;
		}

		const productType = params.get(PRODUCT_QUERY_PARAM);
		const leaveProducts = params.get('leave-products') === 'true';

		if (productType !== 'booking' && !leaveProducts) {
			clearCart();
		}

		setContent(MODAL_CONTENT[productType] || MODAL_CONTENT.default);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!content) {
			return undefined;
		}

		const onKeyDown = (event) => {
			if (event.key === 'Escape') {
				setContent(null);
				stripModalQueryParams();
			}
		};

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [content]);

	if (!content) {
		return null;
	}

	const close = () => {
		setContent(null);
		stripModalQueryParams();
	};

	return (
		<div
			className="ecommerce-modal-backdrop"
			role="presentation"
			onClick={(event) => {
				if (event.target === event.currentTarget) {
					close();
				}
			}}
		>
			<div className="ecommerce-modal" role="dialog" aria-modal="true" aria-label={content.title}>
				<h5 className="ecommerce-modal__title">{content.title}</h5>
				<p className="ecommerce-modal__text">{content.text}</p>
				<button type="button" className="ecommerce-modal__button" onClick={close}>
					{content.buttonText}
				</button>
			</div>
		</div>
	);
}
