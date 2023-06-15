import { ListsTable, Loading, Pagination, Switcher } from 'components';
import { usePagination } from 'hooks';
import { List } from 'models/types';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { polygon } from 'wagmi/chains';

interface PaginationMeta {
	current_page: number;
	total_pages: number;
	total_count: number;
}

const HomePage = () => {
	const [buySideLists, setBuySideLists] = useState<List[]>([]);
	const [sellSideLists, setSellSideLists] = useState<List[]>([]);
	const [lists, setLists] = useState<List[]>([]);
	const [isLoading, setLoading] = useState(false);
	const [type, setType] = useState<string>('Buy');
	const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>();

	const { chain, chains } = useNetwork();
	const chainId = chain?.id || chains[0]?.id || polygon.id;
	const { address } = useAccount();
	const { page, onNextPage, onPrevPage } = usePagination();

	useEffect(() => {
		setLoading(true);
		fetch(`/api/lists?chain_id=${chainId}&page=${page}&type=${type === 'Buy' ? 'SellList' : 'BuyList'}`)
			.then((res) => res.json())
			.then((response: { data: List[]; meta: any }) => {
				const { data, meta } = response;
				setPaginationMeta(meta);
				const toBuyers = data.filter((list) => list.type === 'SellList');
				const toSellers = data.filter((list) => list.type === 'BuyList');
				setSellSideLists(toSellers);
				setBuySideLists(toBuyers);
				setLists(toBuyers);
				setLoading(false);
			});
	}, [chainId, address, page, type]);

	useEffect(() => {
		if (type === 'Buy') {
			setLists(buySideLists);
		} else {
			setLists(sellSideLists);
		}
	}, [type, buySideLists, sellSideLists]);

	if (!lists) return <p>No lists data</p>;

	return (
		<div className="py-6">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
				<Switcher leftLabel="Buy" rightLabel="Sell" selected={type} onToggle={setType} />
				{isLoading ? (
					<Loading />
				) : (
					<div className="py-4">
						<ListsTable lists={lists} />
						{!!lists.length && !!paginationMeta && paginationMeta.total_pages > 1 && (
							<Pagination
								length={lists.length}
								totalCount={paginationMeta.total_count}
								page={page}
								pagesCount={paginationMeta.total_pages}
								onPrevPage={onPrevPage}
								onNextPage={onNextPage}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async () => ({
	props: {
		title: 'Trade P2P'
	}
});

export default HomePage;
