import React from 'react';

export default function CategoryList({
	blockId,
	categories = [],
	currentCategoryId = '',
	defaultCategoryTitle = 'Todos los productos',
	onCategoryChange,
}) {
	const renderLink = (id, title) => (
		<li key={id || 'all'}>
			<a
				className={[
					'category-list__link',
					'text-body',
					currentCategoryId === id ? 'category-list__link--active' : '',
				].filter(Boolean).join(' ')}
				href={id ? `?category=${encodeURIComponent(id)}` : '?'}
				onClick={(event) => {
					event.preventDefault();
					onCategoryChange?.(id);
				}}
			>
				{title}
			</a>
		</li>
	);

	return (
		<>
			<div className="category-list__mobile">
				<div className="category-list__mobile-select-wrapper">
					<label className="category-list__mobile-label" htmlFor={`category-select-${blockId}`}>
						Explorar por:
					</label>
					<div className="category-list__mobile-select-inner-wrapper">
						<select
							id={`category-select-${blockId}`}
							className="category-list__mobile-select"
							value={currentCategoryId}
							onChange={(event) => onCategoryChange?.(event.target.value)}
						>
							<option value="">{defaultCategoryTitle}</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>{category.title}</option>
							))}
						</select>
					</div>
				</div>
			</div>
			<div className="category-list" data-block-id={blockId}>
				<h2 className="category-list__title">Explorar por</h2>
				<ul className="category-list__list">
					{renderLink('', defaultCategoryTitle)}
					{categories.map((category) => renderLink(category.id, category.title))}
				</ul>
			</div>
		</>
	);
}
