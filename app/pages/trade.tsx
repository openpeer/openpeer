import { ListsTable, Loading, Pagination, Switcher } from 'components';
import Filters from 'components/Buy/Filters';
import { usePagination } from 'hooks';
import { SearchFilters } from 'models/search';
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
	const [filters, setFilters] = useState<SearchFilters>({} as SearchFilters);

	const { chain, chains } = useNetwork();
	const chainId = chain?.id || chains[0]?.id || polygon.id;
	const { address } = useAccount();
	const { page, onNextPage, onPrevPage } = usePagination();

	useEffect(() => {
		setLoading(true);
		const params: { [key: string]: string | undefined } = {
			chain_id: chainId.toString(),
			page: page.toString(),
			type: type === 'Buy' ? 'SellList' : 'BuyList',
			amount: filters.amount ? filters.amount.toString() : undefined,
			currency: filters.currency ? filters.currency.id.toString() : undefined,
			payment_method: filters.paymentMethod ? filters.paymentMethod.id.toString() : undefined,
			token: filters.token ? filters.token.id.toString() : undefined,
			fiat_amount: filters.fiatAmount ? filters.fiatAmount.toString() : undefined
		};

		const search = Object.keys(params)
			.filter((key) => !!params[key])
			.reduce((obj, key) => {
				const newObject = obj;
				newObject[key] = params[key] as string;
				return newObject;
			}, {} as { [key: string]: string });

		const searchParams = new URLSearchParams(search);
		fetch(`/api/lists?${searchParams.toString()}`)
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
	}, [chainId, address, page, type, filters]);

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
				<div className="flex flex-row items-center justify-between">
					<Switcher leftLabel="Buy" rightLabel="Sell" selected={type} onToggle={setType} />
					<div className="flex justify-end">
						<Filters onFilterUpdate={setFilters} />
					</div>
				</div>
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
