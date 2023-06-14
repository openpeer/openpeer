import { useState } from 'react';

const usePagination = () => {
	const [page, setPage] = useState(1);

	const onNextPage = () => setPage(page + 1);
	const onPrevPage = () => setPage(page - 1);

	return { page, onNextPage, onPrevPage };
};

export default usePagination;
