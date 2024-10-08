// pages/trade.tsx

import { Button, ListsTable, Loading, Pagination, Switcher } from 'components';
import Filters from 'components/Buy/Filters';
import { usePagination, useAccount } from 'hooks';
import { SearchFilters } from 'models/search';
import { List, User } from 'models/types';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { AdjustmentsVerticalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// Replace getAuthToken import
// import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

interface PaginationMeta {
	current_page: number;
	total_pages: number;
	total_count: number;
}

const HomePage: React.FC = () => {
	const [buySideLists, setBuySideLists] = useState<List[]>([]);
	const [sellSideLists, setSellSideLists] = useState<List[]>([]);
	const [lists, setLists] = useState<List[]>([]);
	const [isLoading, setLoading] = useState(false);
	const [type, setType] = useState<string>('Buy');
	const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>();
	const [filters, setFilters] = useState<SearchFilters>({} as SearchFilters);
	const [showFilters, setShowFilters] = useState(false);
	const [needToReset, setNeedToReset] = useState(false);

	const { page, onNextPage, onPrevPage, resetPage } = usePagination();
	const { address } = useAccount();
	const { authToken } = useDynamicContext(); // Get authToken

	const performSearch = async (selectedPage: number) => {
		setLoading(true);

		const params: { [key: string]: string | undefined } = {
			page: selectedPage.toString(),
			type: type === 'Buy' ? 'SellList' : 'BuyList',
			amount: filters.amount ? filters.amount.toString() : undefined,
			currency: filters.currency ? filters.currency.id.toString() : undefined,
			payment_method: filters.paymentMethod ? filters.paymentMethod.id.toString() : undefined,
			token: filters.token ? filters.token.id.toString() : undefined,
			fiat_amount: filters.fiatAmount ? filters.fiatAmount.toString() : undefined,
			chain_id: filters.chain ? filters.chain.id.toString() : undefined
		};

		const search = Object.keys(params)
			.filter((key) => !!params[key])
			.reduce((obj, key) => {
				const newObject = obj;
				newObject[key] = params[key] as string;
				return newObject;
			}, {} as { [key: string]: string });

		const searchParams = new URLSearchParams(search);

		try {
			console.log('Fetching ads with search params:', searchParams.toString());
			const adsResponse = await fetch(`/api/lists?${searchParams.toString()}`, {
				headers: {
					Authorization: `Bearer ${authToken}`
				}
			}).then((res) => res.json());

			const { data, meta } = adsResponse;
			setPaginationMeta(meta);

			let blockedUserIds = new Set<number>();
			let trustedUsers: User[] = [];
			let trustedByUsers: User[] = [];

			if (address) {
				console.log('Fetching blocked users with address:', address);
				const blockedUsersResponse = await axios.get('/api/user_relationships', {
					headers: {
						'X-User-Address': address
					}
				});

				console.log('Blocked users response:', blockedUsersResponse.data);

				const blockedUsers = blockedUsersResponse.data.blocked_users || [];
				const blockedByUsers = blockedUsersResponse.data.blocked_by_users || [];
				trustedUsers = blockedUsersResponse.data.trusted_users || [];
				trustedByUsers = blockedUsersResponse.data.trusted_by_users || [];

				blockedUserIds = new Set([
					...blockedUsers.map((user: User) => Number(user.id)),
					...blockedByUsers.map((user: User) => Number(user.id))
				]);

				console.log('Blocked User IDs:', Array.from(blockedUserIds));
				console.log(
					'Trusted Users IDs:',
					trustedUsers.map((user) => ({ id: Number(user.id), type: typeof user.id }))
				);
				console.log(
					'Trusted By Users IDs:',
					trustedByUsers.map((user) => ({ id: Number(user.id), type: typeof user.id }))
				);
			}

			const filteredAds = data.filter((list: List) => {
				const isTrustedOnly = list.accept_only_trusted;
				const sellerId = Number(list.seller?.id);

				if (!sellerId) {
					console.log(`Excluding list ${list.id} because seller ID is missing or invalid`);
					return false;
				}

				const sellerTrustedByMe = trustedUsers.some((user: User) => Number(user.id) === sellerId);
				const sellerTrustsMe = trustedByUsers.some((user: User) => Number(user.id) === sellerId);

				const isSellerBlocked = blockedUserIds.has(sellerId);
				const cannotAccessTrustedOnlyAd =
					isTrustedOnly && (!address || (!sellerTrustedByMe && !sellerTrustsMe));

				console.log('Evaluating list:', {
					listId: list.id,
					sellerId,
					isTrustedOnly,
					sellerTrustedByMe,
					sellerTrustsMe,
					isSellerBlocked,
					cannotAccessTrustedOnlyAd
				});

				if (isSellerBlocked) {
					console.log(`Excluding list ${list.id} because seller ${sellerId} is blocked`);
					return false;
				}

				if (cannotAccessTrustedOnlyAd) {
					console.log(
						`Excluding list ${list.id} because it's trusted-only and seller ${sellerId} is neither trusted by you nor trusts you`
					);
					return false;
				}

				console.log(`Including list ${list.id}`);
				return true;
			});

			console.log('Total ads fetched:', data.length);
			console.log('Filtered ads count:', filteredAds.length);

			const toBuyers = filteredAds.filter((list: List) => list.type === 'SellList');
			const toSellers = filteredAds.filter((list: List) => list.type === 'BuyList');

			setSellSideLists(toSellers);
			setBuySideLists(toBuyers);
			setLists(toBuyers);
		} catch (error) {
			console.error('Error fetching ads or blocked users:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		resetPage();
		performSearch(1);
	}, [type, filters]);

	useEffect(() => {
		performSearch(page);
	}, [page]);

	useEffect(() => {
		if (type === 'Buy') {
			setLists(buySideLists);
		} else {
			setLists(sellSideLists);
		}
	}, [type, buySideLists, sellSideLists]);

	if (!lists) return <p>No lists data</p>;

	const handleToggleFilters = () => {
		setShowFilters(!showFilters);
	};

	return (
		<div className="py-6">
			<div className="mx-auto px-4 sm:px-6 md:px-8">
				<div className="flex flex-row items-center justify-between relative">
					<div className="lg:mt-6">
						<Switcher leftLabel="Buy" rightLabel="Sell" selected={type} onToggle={setType} />
					</div>
					<div className="flex items-center lg:hidden lg:justify-end" onClick={handleToggleFilters}>
						<AdjustmentsVerticalIcon
							width={24}
							height={24}
							className="text-gray-600 hover:cursor-pointer"
						/>
						<span className="text-gray-600 hover:cursor-pointer ml-2">Filters</span>
					</div>
					<div className="flex lg:justify-end hidden lg:block">
						<Filters
							onFilterUpdate={setFilters}
							needToReset={needToReset}
							setNeedToReset={setNeedToReset}
						/>
					</div>
				</div>
				{showFilters && (
					<div className="lg:my-8 lg:hidden">
						<Filters
							onFilterUpdate={setFilters}
							needToReset={needToReset}
							setNeedToReset={setNeedToReset}
						/>
					</div>
				)}
				{isLoading ? (
					<Loading />
				) : lists.length > 0 ? (
					<div className="py-4">
						<ListsTable lists={lists} hideLowAmounts />
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
				) : (
					<div className="flex flex-col items-center space-y-8">
						<div className="flex justify-center items-center w-16 h-16 bg-gray-100 p-4 rounded-full">
							<MagnifyingGlassIcon
								width={24}
								height={24}
								className="text-gray-600 hover:cursor-pointer"
							/>
						</div>
						<div>No results within your search</div>
						<div>
							<Button title="Remove all filters" onClick={() => setNeedToReset(true)} />
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async () => ({
	props: {
		title: 'Trade P2P',
		disableAuthentication: true
	}
});

export default HomePage;
