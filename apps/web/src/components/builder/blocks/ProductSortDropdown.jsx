import React from 'react';

export default function ProductSortDropdown({
	blockId,
	productSorting = {},
	sorting = '',
	onSortChange,
}) {
	const options = Array.isArray(productSorting.sortingOptions)
		? productSorting.sortingOptions
		: [];
	const textColor = productSorting.textColor || '#000';

	if (!options.length) {
		return null;
	}

	return (
		<div className="product-list-sorting product-list__sort" data-qa="product-sort-dropdown">
			<label
				htmlFor={`sorting-options-${blockId}`}
				className="product-list-sorting__label"
				style={{ color: textColor }}
			>
				Ordenar por:
			</label>
			<div
				className="product-list-sorting__select-wrapper"
				style={{ color: textColor }}
			>
				<select
					id={`sorting-options-${blockId}`}
					className="product-list-sorting__select"
					value={sorting}
					style={{ color: textColor }}
					onChange={(event) => onSortChange?.(event.target.value)}
				>
					{options.map((option) => (
						<option key={option.id || option.value} value={option.value ?? ''}>
							{option.label || option.id || 'Opción'}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}
