// Common pagination type for all API responses
export type Pagination = {
	totalRecords: number;
	currentPage: number;
	totalPages: number;
	nextPage: number;
	prevPage: number;
};

// Generic API response with pagination
export type PaginatedResponse<T> = {
	data: T[];
	pagination: Pagination;
};
