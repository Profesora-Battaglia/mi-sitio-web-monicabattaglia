/**
 * Windowed page-number triggers matching ZyroPagination (max 5 visible slots).
 * Always includes page 1 and the last page when pageCount exceeds the window.
 */
export function getPaginationTriggers(currentPage, pageCount) {
	const maxVisiblePages = 5;

	if (pageCount <= 0) {
		return [];
	}

	if (maxVisiblePages > pageCount) {
		return [...new Array(pageCount + 1).keys()].slice(1);
	}

	const visiblePagesThreshold = (maxVisiblePages - 1) / 2;
	const paginationTriggersArray = Array.from({
		length: maxVisiblePages - 1,
	}).fill(0);

	if (currentPage <= visiblePagesThreshold + 1) {
		paginationTriggersArray[0] = 1;
		const paginationTriggers = paginationTriggersArray.map(
			(_paginationTrigger, index) => paginationTriggersArray[0] + index,
		);

		paginationTriggers.push(pageCount);

		return paginationTriggers;
	}

	if (currentPage >= pageCount - visiblePagesThreshold + 1) {
		const paginationTriggers = paginationTriggersArray.map(
			(_paginationTrigger, index) => pageCount - index,
		);

		paginationTriggers.reverse().unshift(1);

		return paginationTriggers;
	}

	paginationTriggersArray[0] = currentPage - visiblePagesThreshold + 1;
	const paginationTriggers = paginationTriggersArray.map(
		(_paginationTrigger, index) => paginationTriggersArray[0] + index,
	);

	paginationTriggers.unshift(1);
	paginationTriggers[paginationTriggers.length - 1] = pageCount;

	return paginationTriggers;
}
