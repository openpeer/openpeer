import { getAuthToken } from '@dynamic-labs/sdk-react';
import { Button, Label, ListsTable, Loading } from 'components';
import { List } from 'models/types';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'hooks';
import Link from 'next/link';

const Ads = () => {
	const [lists, setLists] = useState<List[]>();
	const { address } = useAccount();

	useEffect(() => {
		if (!address) return;
		fetch('/api/lists/ads', {
			headers: {
				Authorization: `Bearer ${getAuthToken()}`
			}
		})
			.then((res) => res.json())
			.then((data) => {
				setLists(data);
			});
	}, [address]);

	if (lists === undefined) {
		return <Loading />;
	}

	if (lists.length === 0) {
		return (
			<Loading
				spinner={false}
				message={
					<Link className="flex flex-col items-center space-y-2" href="/sell">
						<div>You do not have any ads yet</div>
						<div>
							<Button title="Create an ad" />
						</div>
					</Link>
				}
			/>
		);
	}

	const sellLists = lists.filter((l) => l.type === 'SellList');
	const buyLists = lists.filter((l) => l.type === 'BuyList');

	return (
		<div className="py-6">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
				{sellLists.length > 0 && (
					<div className="mb-4">
						<Label title="Buy Ads" />
						<ListsTable lists={lists.filter((l) => l.type === 'SellList')} />
					</div>
				)}
				{buyLists.length > 0 && (
					<div>
						<Label title="Sell Ads" />
						<ListsTable lists={lists.filter((l) => l.type === 'BuyList')} />
					</div>
				)}
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async () => ({
	props: { title: 'My Ads' }
});

export default Ads;
