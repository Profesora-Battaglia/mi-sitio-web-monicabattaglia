import React from 'react';

export default function BlogListItemCategories({
	categories = [],
	blogCategories = {},
	onFilterCategory,
}) {
	const ids = Array.isArray(categories) ? categories : [];
	if (!ids.length) {
		return null;
	}

	return (
		<p className="blog-categories font-secondary">
			{ids.map((categoryId) => {
				const name = blogCategories[categoryId]?.name?.toUpperCase();
				if (!name) {
					return null;
				}

				return (
					<span
						key={categoryId}
						className="blog-categories__item"
						onClick={(event) => {
							event.preventDefault();
							event.stopPropagation();
							onFilterCategory?.(categoryId);
						}}
						onKeyDown={(event) => {
							if (event.key === 'Enter' || event.key === ' ') {
								event.preventDefault();
								event.stopPropagation();
								onFilterCategory?.(categoryId);
							}
						}}
						role={onFilterCategory ? 'button' : undefined}
						tabIndex={onFilterCategory ? 0 : undefined}
					>
						{name}
					</span>
				);
			})}
		</p>
	);
}
