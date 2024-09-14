export const paginateResults = <T>(
	items: T[],
	page: number,
	pageSize: number,
): {
	paginatedItems: T[];
	totalItems: number;
	currentPage: number;
	pageSize: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
} => {
	const totalItems = items.length;
	const totalPages = Math.ceil(totalItems / pageSize);
	const startIndex = (page - 1) * pageSize;
	const endIndex = Math.min(startIndex + pageSize, totalItems);

	return {
		paginatedItems: items.slice(startIndex, endIndex),
		totalItems,
		currentPage: page,
		pageSize,
		totalPages,
		hasNextPage: endIndex < totalItems,
		hasPreviousPage: page > 1,
	};
};
