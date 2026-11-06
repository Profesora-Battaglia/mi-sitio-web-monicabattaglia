import React from 'react';
import { DEFAULT_MIN_READ_TEXT } from './blogHelpers.js';

export default function BlogListItemMeta({
	authorName = '',
	minutesAmount = '0',
	blogReadingTimeText = '',
	date = '',
	showName = true,
	showDate = true,
	showMinutes = true,
}) {
	const readingLabel = `${minutesAmount} ${blogReadingTimeText || DEFAULT_MIN_READ_TEXT}`;

	return (
		<div className="blog-list-item-meta">
			<div className="font-secondary">
				{showName && authorName ? (
					<p className="blog-list-item-meta__author-name">{authorName}</p>
				) : null}
				{(showDate || showMinutes) ? (
					<p className="blog-list-item-meta__subtitle">
						{showDate && date ? (
							<span className="blog-list-item-meta__date">{date}</span>
						) : null}
						{showMinutes ? (
							<span className="blog-list-item-meta__minutes">{readingLabel}</span>
						) : null}
					</p>
				) : null}
			</div>
		</div>
	);
}
