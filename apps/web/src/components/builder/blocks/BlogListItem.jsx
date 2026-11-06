import React from 'react';
import SmartLink from '../SmartLink.jsx';
import BlogListItemCategories from './BlogListItemCategories.jsx';
import BlogListItemMeta from './BlogListItemMeta.jsx';
import { getFormattedNumericDate } from './blogHelpers.js';

export default function BlogListItem({
	post,
	shownItems = {},
	blogCategories = {},
	blogReadingTimeText,
	blogTitleTextSize = 24,
	onFilterCategory,
}) {
	const categories = Array.isArray(post?.categories) ? post.categories : [];
	const isCoverImageShown = Boolean(
		shownItems.coverImage && (post?.coverImageSrc || post?.coverImageSrcset),
	);
	const href = post?.slug || '#';

	return (
		<article className="block-blog-list-item">
			{isCoverImageShown ? (
				<SmartLink href={href} className="block-blog-list-item__cover-image-container">
					<div className="block-blog-list-item__cover-image-wrapper">
						<img
							className="block-blog-list-item__cover-image"
							alt={post.coverImageAlt || ''}
							src={post.coverImageSrc}
							srcSet={post.coverImageSrcset || undefined}
							sizes="(max-width: 920px) 100vw, 600px"
							loading="lazy"
						/>
					</div>
				</SmartLink>
			) : null}

			{shownItems.categories && categories.length ? (
				<BlogListItemCategories
					categories={categories}
					blogCategories={blogCategories}
					onFilterCategory={onFilterCategory}
				/>
			) : null}

			<SmartLink href={href} className="block-blog-list-item__content">
				{shownItems.title ? (
					<h3
						className="font-primary block-blog-list-item__title"
						style={{ fontSize: `${blogTitleTextSize}px` }}
					>
						{post?.meta?.title || ''}
					</h3>
				) : null}
				{shownItems.description ? (
					<p className="block-blog-list-item__description font-secondary">
						{post?.meta?.description || ''}
					</p>
				) : null}
				<BlogListItemMeta
					authorName={post?.meta?.authorName || ''}
					minutesAmount={post?.minutesToRead || '0'}
					date={getFormattedNumericDate(post?.date)}
					showName={shownItems.authorFullName}
					showDate={shownItems.date}
					showMinutes={shownItems.minutesToRead}
					blogReadingTimeText={blogReadingTimeText}
				/>
			</SmartLink>
		</article>
	);
}
