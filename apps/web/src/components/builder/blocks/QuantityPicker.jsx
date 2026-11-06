import React from 'react';

export default function QuantityPicker({
	quantity = 1,
	size = 48,
	fontSize = 16,
	isLimitReached = false,
	isStockAvailable = true,
	onChange,
}) {
	const style = {
		'--size': `${size}px`,
		'--font-size': `${fontSize}px`,
	};

	const handleInput = (event) => {
		const { value } = event.target;

		if (value === '') {
			return;
		}

		if (/^\d+$/.test(value)) {
			onChange?.(Number(value));
		}
	};

	const handleBlur = (event) => {
		if (event.target.value === '') {
			onChange?.(1);
		}
	};

	return (
		<span className="quantity-picker" style={style}>
			<button
				type="button"
				className="quantity-picker__control"
				onClick={() => onChange?.(quantity - 1)}
			>
				-
			</button>
			<input
				className="quantity-picker__amount"
				value={quantity}
				onChange={handleInput}
				onBlur={handleBlur}
			/>
			<button
				type="button"
				className="quantity-picker__control"
				disabled={!isStockAvailable || isLimitReached}
				onClick={() => onChange?.(quantity + 1)}
			>
				+
			</button>
		</span>
	);
}
