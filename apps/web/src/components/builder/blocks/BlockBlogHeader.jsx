import React from 'react';
import BlockBackground from './BlockBackground.jsx';
import BlogListItemCategories from './BlogListItemCategories.jsx';
import BlogListItemMeta from './BlogListItemMeta.jsx';
import { getFormattedNumericDate } from './blogHelpers.js';

export default function BlockBlogHeader({
	blockId,
	blockClassName = 'block block--blog-header',
	style = {},
	shownItems = {},
	blogTitleFontSize = 32,
	post = {},
	blogCategories = {},
	blogReadingTimeText,
	background,
	isFixed = false,
	backgroundImagePosition,
}) {
	const categories = Array.isArray(post.categories) ? post.categories : [];
	const areCategoriesShown = Boolean(shownItems.categories && categories.length);

	return (
		<section
			id={blockId}
			className={blockClassName}
			style={style}
			data-block-id={blockId}
			data-pagefind-ignore
		>
			{background ? (
				<BlockBackground
					background={background}
					isFixed={isFixed}
					backgroundImagePosition={backgroundImagePosition}
				/>
			) : null}
			<div className="block-blog-header">
				<div className="block-blog-header__content">
					<h1
						className="font-primary block-blog-header__title"
						style={{ fontSize: `${blogTitleFontSize || 32}px` }}
						data-pagefind-meta="title"
					>
						{post.title || ''}
					</h1>
					{shownItems.description ? (
						<p className="font-secondary block-blog-header__description">
							{post.description || ''}
						</p>
					) : null}
					{areCategoriesShown ? (
						<BlogListItemCategories
							categories={categories}
							blogCategories={blogCategories}
						/>
					) : null}
					<BlogListItemMeta
						authorName={post.authorName || ''}
						minutesAmount={post.minutesToRead || '0'}
						date={getFormattedNumericDate(post.date)}
						showName={shownItems.authorFullName}
						showDate={shownItems.date}
						showMinutes={shownItems.minutesToRead}
						blogReadingTimeText={blogReadingTimeText}
					/>
				</div>
			</div>
		</section>
	);
}
