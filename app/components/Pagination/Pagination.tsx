import React from 'react';

interface PaginationProps {
	length: number;
	totalCount: number;
	page: number;
	pagesCount: number;
	onNextPage: () => void;
	onPrevPage: () => void;
}

const Pagination = ({ length, totalCount, page, pagesCount, onNextPage, onPrevPage }: PaginationProps) => (
	<nav
		className="flex items-center justify-between border-t border-gray-200 px-4 py-8 sm:px-6 mt-8"
		aria-label="Pagination"
	>
		<div className="sm:m-2">
			<p className="text-sm text-gray-700">
				Showing <span className="font-medium">{length}</span> of
				<span className="font-medium"> {totalCount}</span> results
			</p>
		</div>
		<div className="flex flex-1 justify-end">
			{page > 1 && (
				<div
					onClick={onPrevPage}
					className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
				>
					Previous
				</div>
			)}
			{page < pagesCount && (
				<div
					onClick={onNextPage}
					className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
				>
					Next
				</div>
			)}
		</div>
	</nav>
);

export default Pagination;
