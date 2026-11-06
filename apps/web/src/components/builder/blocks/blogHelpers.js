export const DEFAULT_MIN_READ_TEXT = 'min de lectura';
export const SHOW_ALL_POSTS_LABEL = 'Mostrar todas las publicaciones';

export function getFormattedNumericDate(date) {
	if (!date) {
		return '';
	}

	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) {
		return '';
	}

	return parsed.toLocaleDateString('es-AR');
}

export function startOfDayTimestamp(date) {
	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) {
		return null;
	}

	return new Date(parsed).setHours(0, 0, 0, 0);
}

export function isVisibleBlogPost(post, now = Date.now()) {
	if (!post || post.isDraft) {
		return false;
	}

	if (!post.isScheduled) {
		return true;
	}

	const publishDate = startOfDayTimestamp(post.date);
	if (publishDate == null) {
		return false;
	}

	const today = new Date(now).setHours(0, 0, 0, 0);
	return publishDate <= today;
}

export function sortBlogPostsNewestFirst(posts) {
	return posts
		.map((post, index) => {
			const timestamp = startOfDayTimestamp(post.date);
			return {
				post,
				index,
				timestamp,
			};
		})
		.sort((first, second) => {
			if (first.timestamp == null && second.timestamp == null) {
				return first.index - second.index;
			}
			if (first.timestamp == null) {
				return 1;
			}
			if (second.timestamp == null) {
				return -1;
			}
			if (second.timestamp !== first.timestamp) {
				return second.timestamp - first.timestamp;
			}
			return first.index - second.index;
		})
		.map(({ post }) => post);
}

export function matchesLocalBlogSearch(post, searchTerm) {
	const term = String(searchTerm || '').trim().toLowerCase();
	if (!term) {
		return true;
	}

	const title = String(post?.meta?.title || '').toLowerCase();
	const description = String(post?.meta?.description || '').toLowerCase();
	return title.includes(term) || description.includes(term);
}
