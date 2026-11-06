import React, { useRef } from 'react';
import { getPaginationTriggers } from './paginationTriggers.js';

function ChevronLeft() {
	return (
		<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
			<path d="M7 1L1 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function ChevronRight() {
	return (
		<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
			<path d="M1 13L7 7L1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export default function ProductListPagination({
	currentPage = 1,
	pageCount = 1,
	onPageChange,
	scrollTargetRef,
}) {
	const localRef = useRef(null);

	if (pageCount <= 1) {
		return null;
	}

	const goToPage = (page) => {
		if (page < 1 || page > pageCount || page === currentPage) {
			return;
		}

		onPageChange?.(page);

		const target = scrollTargetRef?.current || localRef.current?.closest?.('.block-product-list');
		if (target?.scrollIntoView) {
			target.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}
	};

	const pages = getPaginationTriggers(currentPage, pageCount);

	return (
		<div ref={localRef}>
			<div
				className="pagination product-list-pagination"
				style={{
					'--button-color': 'var(--body-color)',
				}}
			>
				<button
					type="button"
					className="pagination__button"
					aria-label="Página anterior"
					data-qa="button-previous"
					disabled={currentPage <= 1}
					onClick={() => goToPage(currentPage - 1)}
				>
					<ChevronLeft />
				</button>
				{pages.map((page) => {
					const isCurrent = page === currentPage;
					return (
						<button
							key={page}
							type="button"
							className={[
								'pagination__button',
								'pagination__trigger',
								isCurrent ? 'pagination__trigger--current' : '',
							].filter(Boolean).join(' ')}
							aria-label={`Ir a la página ${page}`}
							aria-current={isCurrent ? 'page' : undefined}
							disabled={isCurrent}
							data-qa={`button-${page}`}
							onClick={() => goToPage(page)}
						>
							{page}
						</button>
					);
				})}
				<button
					type="button"
					className="pagination__button"
					aria-label="Página siguiente"
					data-qa="button-next"
					disabled={currentPage >= pageCount}
					onClick={() => goToPage(currentPage + 1)}
				>
					<ChevronRight />
				</button>
			</div>
		</div>
	);
}
