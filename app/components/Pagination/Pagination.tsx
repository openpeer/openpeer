interface PaginationProps {
	next: string;
	prev: string;
	minResult: string;
	maxResult: string;
	totalResult: string;
}

const Pagintion = ({ next, prev, minResult, maxResult, totalResult }: PaginationProps) => {
	return (
		<>
			<nav
				className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-8"
				aria-label="Pagination"
			>
				<div className="hidden sm:block">
					<p className="text-sm text-gray-700">
						Showing <span className="font-medium">{minResult}</span> to{' '}
						<span className="font-medium">{maxResult}</span> of{' '}
						<span className="font-medium">{totalResult}</span> results
					</p>
				</div>
				<div className="flex flex-1 justify-between sm:justify-end">
					<a
						href={prev}
						className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
					>
						Previous
					</a>
					<a
						href={next}
						className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
					>
						Next
					</a>
				</div>
			</nav>
		</>
	);
};

export default Pagintion;
