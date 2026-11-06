import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import QuantityPicker from './QuantityPicker.jsx';
import { productPlaceholderImage } from '@/data/ecommerce';

const EcommerceCartContext = createContext(null);
const STORAGE_KEY = 'shopping-cart-items';
const STORAGE_TTL_MS = 24 * 60 * 60 * 1000;

export function getCheckoutSuccessUrl(items) {
	const types = (items || []).map((item) => item?.type).filter(Boolean);
	const params = new URLSearchParams({ 'open-modal': 'EcommerceCheckoutSuccess' });

	if (types.length && types.every((type) => type === 'donation')) {
		params.set('product', 'donation');
	} else if (types.includes('booking')) {
		params.set('product', 'booking');
	} else if (types.includes('digital')) {
		params.set('product', 'digital');
	}

	const origin = typeof window !== 'undefined' ? window.location.origin : '';
	return `${origin}/?${params.toString()}`;
}

export function getCheckoutCancelUrl() {
	if (typeof window === 'undefined') {
		return '';
	}
	return `${window.location.origin}${window.location.pathname}`;
}

function readStoredItems() {
	if (typeof window === 'undefined') {
		return [];
	}

	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return [];
		}
		const parsed = JSON.parse(raw);
		if (!parsed?.savedAt || Date.now() - parsed.savedAt > STORAGE_TTL_MS) {
			window.localStorage.removeItem(STORAGE_KEY);
			return [];
		}
		return Array.isArray(parsed.items) ? parsed.items : [];
	} catch {
		return [];
	}
}

function persistItems(items) {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
			savedAt: Date.now(),
			items,
		}));
	} catch {
		// Ignore quota / private mode failures.
	}
}

export function EcommerceCartProvider({ children }) {
	const [isOpen, setIsOpen] = useState(false);
	const [items, setItems] = useState(() => readStoredItems());
	const [checkoutStatus, setCheckoutStatus] = useState('idle');

	useEffect(() => {
		persistItems(items);
	}, [items]);

	const api = useMemo(() => {
		const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

		return {
			isOpen,
			items,
			itemCount,
			checkoutStatus,
			openCart: () => setIsOpen(true),
			closeCart: () => setIsOpen(false),
			toggleCart: () => setIsOpen((current) => !current),
			setItems,
			addItem: (item) => {
				setItems((current) => {
					const key = item?.variant_id || item?.id;
					const existing = current.find((entry) => (entry.variant_id || entry.id) === key);
					if (existing) {
						return current.map((entry) => (
							(entry.variant_id || entry.id) === key
								? {
									...entry,
									quantity: (entry.quantity || 1) + (item.quantity || 1),
								}
								: entry
						));
					}
					return [...current, {
						...item,
						quantity: item.quantity || 1,
					}];
				});
				setIsOpen(true);
			},
			removeItem: (itemId) => {
				setItems((current) => current.filter((entry) => (entry.variant_id || entry.id) !== itemId));
			},
			setItemQuantity: (itemId, quantity) => {
				setItems((current) => (quantity > 0
					? current.map((entry) => ((entry.variant_id || entry.id) === itemId
						? {
							...entry,
							quantity,
						}
						: entry))
					: current.filter((entry) => (entry.variant_id || entry.id) !== itemId)));
			},
			clearCart: () => setItems([]),
			checkout: async () => {
				if (!items.length) {
					return;
				}

				setCheckoutStatus('loading');
				try {
					const ecommerceApi = await import('@/api/EcommerceApi.js');
					if (!ecommerceApi.initializeCheckout) {
						throw new Error('initializeCheckout unavailable');
					}

					const result = await ecommerceApi.initializeCheckout({
						items: items.map((item) => ({
							variant_id: item.variant_id || item.id,
							quantity: item.quantity || 1,
							...(item.custom_fields?.length ? { customFieldValues: item.custom_fields } : {}),
						})),
						successUrl: getCheckoutSuccessUrl(items),
						cancelUrl: getCheckoutCancelUrl(),
					});

					const checkoutUrl = result?.checkout_url || result?.url || result?.redirect_url;
					if (checkoutUrl && typeof window !== 'undefined') {
						window.location.assign(checkoutUrl);
						return;
					}

					setCheckoutStatus('success');
				} catch (error) {
					console.warn('[EcommerceCart] checkout failed', error);
					setCheckoutStatus('error');
				}
			},
		};
	}, [isOpen, items, checkoutStatus]);

	return (
		<EcommerceCartContext.Provider value={api}>
			{children}
			<EcommerceCart
				isOpen={api.isOpen}
				items={api.items}
				checkoutStatus={api.checkoutStatus}
				onClose={api.closeCart}
				onRemove={api.removeItem}
				onQuantityChange={api.setItemQuantity}
				onCheckout={api.checkout}
			/>
		</EcommerceCartContext.Provider>
	);
}

export function useEcommerceCart() {
	const context = useContext(EcommerceCartContext);
	if (!context) {
		return {
			isOpen: false,
			items: [],
			itemCount: 0,
			checkoutStatus: 'idle',
			openCart: () => {},
			closeCart: () => {},
			toggleCart: () => {},
			setItems: () => {},
			addItem: () => {},
			removeItem: () => {},
			setItemQuantity: () => {},
			clearCart: () => {},
			checkout: async () => {},
		};
	}
	return context;
}

/** Prices travel as minor units, the same as the store API reports them. */
function getFormattedSubtotal(items) {
	const priced = items.filter((item) => typeof item.price_amount === 'number');

	if (!priced.length) {
		return '';
	}

	const total = priced.reduce((sum, item) => sum + item.price_amount * (item.quantity || 1), 0);
	const currencyInfo = priced.find((item) => item.currency_info)?.currency_info;

	if (currencyInfo) {
		const digits = Number.isInteger(currencyInfo.decimal_digits) ? currencyInfo.decimal_digits : 2;
		const amount = (total / (10 ** digits)).toFixed(digits);

		return currencyInfo.template
			? currencyInfo.template.replace('$1', amount)
			: `${currencyInfo.symbol || currencyInfo.code || ''}${amount}`;
	}

	const currency = priced.find((item) => item.currency)?.currency;

	if (!currency) {
		return String(total / 100);
	}

	try {
		return new Intl.NumberFormat(undefined, {
			style: 'currency',
			currency: currency.toUpperCase(),
		}).format(total / 100);
	} catch (error) {
		return `${(total / 100).toFixed(2)} ${currency.toUpperCase()}`;
	}
}

export default function EcommerceCart({
	isOpen = false,
	items = [],
	checkoutStatus = 'idle',
	onClose,
	onRemove,
	onQuantityChange,
	onCheckout,
}) {
	if (!isOpen) {
		return null;
	}

	const subtotal = getFormattedSubtotal(items);

	return (
		<aside
			className="ecommerce-cart cart-drawer"
			role="dialog"
			aria-label="Carrito de compras"
		>
			<header className="ecommerce-cart__header">
				<strong>Carrito</strong>
				{onClose ? (
					<button type="button" className="ecommerce-cart__close" onClick={onClose}>
						Cerrar
					</button>
				) : null}
			</header>
			{items.length ? (
				<ul className="ecommerce-cart__list">
					{items.map((item) => {
						const key = item.variant_id || item.id;
						const price = item.price_formatted || item.price || '';
						const thumbnail = item.image || productPlaceholderImage;
						return (
							<li key={key} className="ecommerce-cart__item">
								<div className="ecommerce-cart__item-main">
									{thumbnail ? (
										<img src={thumbnail} alt="" className="ecommerce-cart__thumb" />
									) : null}
									<div>
										<div>{item.title || item.name || 'Artículo'}</div>
										{item.variant_title ? (
											<div className="ecommerce-cart__variant">{item.variant_title}</div>
										) : null}
										{(item.custom_fields || []).map((field) => (
											<div key={field.title} className="ecommerce-cart__custom-field">
												{`${field.title}: ${field.value}`}
											</div>
										))}
										<div className="ecommerce-cart__meta">
											{price}
										</div>
										{onQuantityChange ? (
											<QuantityPicker
												quantity={item.quantity || 1}
												size={32}
												fontSize={14}
												onChange={(next) => onQuantityChange(key, next)}
											/>
										) : (
											<div className="ecommerce-cart__meta">
												{item.quantity != null ? `× ${item.quantity}` : ''}
											</div>
										)}
									</div>
								</div>
								{onRemove ? (
									<button type="button" onClick={() => onRemove(key)}>
										Quitar
									</button>
								) : null}
							</li>
						);
					})}
				</ul>
			) : (
				<p className="ecommerce-cart__empty">Tu carrito está vacío</p>
			)}
			<div className="ecommerce-cart__footer">
				{subtotal ? (
					<p className="ecommerce-cart__subtotal">
						<span>Subtotal:</span>
						<strong>{subtotal}</strong>
					</p>
				) : null}
				{checkoutStatus === 'error' ? (
					<p className="ecommerce-cart__error">No se pudo completar la compra. Intentá de nuevo.</p>
				) : null}
				<button
					type="button"
					className="ecommerce-cart__checkout"
					disabled={!items.length || checkoutStatus === 'loading'}
					onClick={onCheckout}
				>
					{checkoutStatus === 'loading' ? 'Iniciando pago…' : 'Finalizar compra'}
				</button>
			</div>
		</aside>
	);
}
