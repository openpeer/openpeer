// pages/ads/index.tsx

import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { AdjustmentsHorizontalIcon, PlusIcon } from '@heroicons/react/24/solid';
import { Button, Label, ListsTable, Loading } from 'components';
import IconButton from 'components/Button/IconButton';
import { List } from 'models/types';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import Link from 'next/link';

const Ads = () => {
	const [lists, setLists] = useState<List[]>();
	const { address } = useAccount();
	const router = useRouter();

	useEffect(() => {
		if (!address) return;
		const authToken = getAuthToken();
		if (!authToken) {
			console.error('Authorization token missing');
			return;
		}

		fetch('/api/lists/ads', {
			headers: {
				Authorization: `Bearer ${authToken}`,
				'X-User-Address': address
			}
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error(`HTTP error! Status: ${res.status}`);
				}
				return res.json();
			})
			.then((data) => {
				if (Array.isArray(data)) {
					setLists(data);
				} else {
					console.error('Unexpected data structure:', data);
					setLists([]);
				}
			})
			.catch((error) => {
				console.error('Error fetching lists:', error);
				setLists([]);
			});
	}, [address]);

	if (lists === undefined) {
		return <Loading />;
	}

	const settingsPath = () => {
		router.push('/ads/settings');
	};

	const createAddPath = () => {
		router.push('/sell');
	};

	// Include all ads in the sell and buy lists, regardless of status
	const sellLists = lists.filter((l) => l.type === 'SellList');
	const buyLists = lists.filter((l) => l.type === 'BuyList');

	return (
		<div className="py-6">
			<div className="flex flex-col mx-auto px-4 sm:px-6 md:px-8">
				<div className="flex flex-row justify-end mb-4 space-x-4">
					<IconButton
						outlined
						title="Settings"
						icon={<AdjustmentsHorizontalIcon width="20" height="20" />}
						onClick={settingsPath}
					/>
					<IconButton
						title="Create New Ad"
						icon={<PlusIcon width="20" height="20" />}
						onClick={createAddPath}
					/>
				</div>
				{lists.length > 0 ? (
					<>
						{sellLists.length > 0 && (
							<div className="mb-4">
								<Label title="Buy Ads" />
								<ListsTable lists={sellLists} />
							</div>
						)}
						{buyLists.length > 0 && (
							<div>
								<Label title="Sell Ads" />
								<ListsTable lists={buyLists} />
							</div>
						)}
					</>
				) : (
					<Loading
						spinner={false}
						message={
							<Link className="flex flex-col items-center space-y-2" href="/sell">
								<div>You do not have any ads yet</div>
								<div>
									<Button title="Create an Ad" />
								</div>
							</Link>
						}
					/>
				)}
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async () => ({
	props: { title: 'My Ads' }
});

export default Ads;
