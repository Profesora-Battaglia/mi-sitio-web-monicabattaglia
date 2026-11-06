import React, {
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import BlockBackground from './BlockBackground.jsx';
import BlogListItem from './BlogListItem.jsx';
import ProductListPagination from './ProductListPagination.jsx';
import {
	isVisibleBlogPost,
	matchesLocalBlogSearch,
	SHOW_ALL_POSTS_LABEL,
	sortBlogPostsNewestFirst,
} from './blogHelpers.js';

function readPageFromUrl() {
	if (typeof window === 'undefined') {
		return 1;
	}
	const params = new URLSearchParams(window.location.search);
	const page = Number.parseInt(params.get('page') || '1', 10);
	return Number.isFinite(page) && page > 0 ? page : 1;
}

function writePageToUrl(page, { replace = false } = {}) {
	if (typeof window === 'undefined') {
		return;
	}
	const url = new URL(window.location.href);
	url.searchParams.set('page', String(page));
	if (replace) {
		window.history.replaceState(null, '', url.toString());
	} else {
		window.history.pushState(null, '', url.toString());
	}
}

export default function BlockBlogList({
	blockId,
	blockClassName = 'block block--blog-list',
	style = {},
	settings = {},
	blogSearch = {},
	posts = {},
	blogCategories = {},
	blogReadingTimeText,
	background,
	isFixed = false,
	backgroundImagePosition,
}) {
	const sectionRef = useRef(null);
	const [currentPage, setCurrentPage] = useState(() => readPageFromUrl());
	const [filteredCategoryId, setFilteredCategoryId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const postsPerPage = Number(settings.postsPerPage) > 0 ? Number(settings.postsPerPage) : 6;
	const postColumnCount = Number(settings.postColumnCount) > 0
		? Number(settings.postColumnCount)
		: 3;
	const shownItems = settings.shownItems || {};
	const blogTitleTextSize = settings.blogTitleFontSize || 24;
	const isSearchEnabled = Boolean(blogSearch?.isEnabled);
	const searchPlaceholderText = blogSearch?.placeholderText || 'Buscar publicaciones';
	const searchNoResultsText = blogSearch?.noResultsText || 'No se encontraron resultados';
	const searchStyles = {
		fillColor: blogSearch?.fillColor || 'rgb(255, 255, 255)',
		textAndIconColor: blogSearch?.textAndIconColor || 'rgb(0, 0, 0)',
		borderColor: blogSearch?.borderColor || 'rgb(218, 220, 224)',
		borderRadius: blogSearch?.borderRadius ?? 4,
		inputAlignment: blogSearch?.inputAlignment || 'center',
		width: `${blogSearch?.width ?? 250}px`,
	};
	const paginationColor = style?.['--blog-post-header-text-color'] || 'rgb(0, 0, 0)';

	const listedPosts = useMemo(() => {
		const allPosts = Object.values(posts || {});
		const {
			categories = [],
			showAllPosts = true,
			showWithoutCategories = false,
		} = settings;

		const categoryFiltered = showAllPosts
			? allPosts
			: allPosts.filter((post) => {
				const isPostIncludedInList = categories.some(
					(listCategory) => post.categories?.includes(listCategory),
				);
				const showUncategorized = showWithoutCategories
					&& (!post.categories || post.categories.length === 0);
				return showUncategorized || isPostIncludedInList;
			});

		const activeCategoryFiltered = filteredCategoryId
			? categoryFiltered.filter((post) => post.categories?.includes(filteredCategoryId))
			: categoryFiltered;

		const visiblePosts = activeCategoryFiltered.filter((post) => isVisibleBlogPost(post));
		const sorted = sortBlogPostsNewestFirst(visiblePosts);

		if (!isSearchEnabled || !String(searchTerm || '').trim()) {
			return sorted;
		}

		return sorted.filter((post) => matchesLocalBlogSearch(post, searchTerm));
	}, [
		posts,
		settings,
		filteredCategoryId,
		isSearchEnabled,
		searchTerm,
	]);

	const pageCount = Math.max(1, Math.ceil(listedPosts.length / postsPerPage));
	const safePage = Math.min(currentPage, pageCount);
	const currentPageItems = listedPosts.slice(
		(safePage - 1) * postsPerPage,
		safePage * postsPerPage,
	);
	const isSearchActive = isSearchEnabled && Boolean(String(searchTerm || '').trim());

	useEffect(() => {
		const onPopState = () => {
			const pageFromUrl = readPageFromUrl();
			setCurrentPage((current) => (current === pageFromUrl ? current : pageFromUrl));
		};
		window.addEventListener('popstate', onPopState);
		return () => window.removeEventListener('popstate', onPopState);
	}, []);

	useEffect(() => {
		if (currentPageItems.length === 0 && currentPage > 1) {
			setCurrentPage((page) => page - 1);
		}
	}, [currentPageItems.length, currentPage]);

	const isFirstSearchEffect = useRef(true);
	useEffect(() => {
		if (isFirstSearchEffect.current) {
			isFirstSearchEffect.current = false;
			return;
		}
		if (!isSearchEnabled) {
			return;
		}
		setCurrentPage(1);
		writePageToUrl(1, { replace: true });
	}, [searchTerm, isSearchEnabled]);

	const handlePageChange = (page) => {
		setCurrentPage(page);
		writePageToUrl(page);
		sectionRef.current?.scrollIntoView?.({
			behavior: 'smooth',
			block: 'start',
		});
	};

	const sectionStyle = {
		...style,
		'--blog-list-columns': String(postColumnCount),
		'--blog-search-width': searchStyles.width,
		'--blog-search-fill': searchStyles.fillColor,
		'--blog-search-text': searchStyles.textAndIconColor,
		'--blog-search-border': searchStyles.borderColor,
		'--blog-search-radius': `${searchStyles.borderRadius}px`,
		'--blog-pagination-color': paginationColor,
	};

	return (
		<section
			ref={sectionRef}
			id={blockId}
			className={blockClassName}
			style={sectionStyle}
			data-block-id={blockId}
		>
			{background ? (
				<BlockBackground
					background={background}
					isFixed={isFixed}
					backgroundImagePosition={backgroundImagePosition}
				/>
			) : null}
			<div className="block-blog-list">
				{isSearchEnabled ? (
					<div className="block-blog-list__header">
						<input
							type="search"
							className={[
								'block-blog-list__search',
								`block-blog-list__search--${searchStyles.inputAlignment}`,
							].join(' ')}
							placeholder={searchPlaceholderText}
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
							aria-label={searchPlaceholderText}
						/>
					</div>
				) : null}

				{filteredCategoryId && blogCategories[filteredCategoryId] ? (
					<div className="block-blog-list__filter">
						{blogCategories[filteredCategoryId].name}
						<button
							type="button"
							className="block-blog-list__filter-button"
							onClick={() => setFilteredCategoryId(null)}
						>
							{SHOW_ALL_POSTS_LABEL}
						</button>
					</div>
				) : null}

				{currentPageItems.length ? (
					<div
						className={[
							'block-blog-list__list',
							postColumnCount === 1 ? 'block-blog-list__list--one-col' : '',
						].filter(Boolean).join(' ')}
					>
						{currentPageItems.map((post) => (
							<BlogListItem
								key={post.id}
								post={post}
								shownItems={shownItems}
								blogCategories={blogCategories}
								blogReadingTimeText={blogReadingTimeText}
								blogTitleTextSize={blogTitleTextSize}
								onFilterCategory={setFilteredCategoryId}
							/>
						))}
					</div>
				) : (
					isSearchActive ? (
						<p className="block-blog-list__no-results">{searchNoResultsText}</p>
					) : (
						<div className="block-blog-list__empty-block" />
					)
				)}

				<div
					className="block-blog-list__pagination"
					style={{ '--button-color': 'var(--blog-pagination-color)' }}
				>
					<ProductListPagination
						currentPage={safePage}
						pageCount={pageCount}
						onPageChange={handlePageChange}
						scrollTargetRef={sectionRef}
					/>
				</div>
			</div>
		</section>
	);
}
