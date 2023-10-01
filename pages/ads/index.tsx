import { getAuthToken } from '@dynamic-labs/sdk-react';
import { AdjustmentsHorizontalIcon, PlusIcon } from '@heroicons/react/24/solid';
import { ListsTable, Loading } from 'components';
import IconButton from 'components/Button/IconButton';
import { List } from 'models/types';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';

const Ads = () => {
	const [lists, setLists] = useState<List[]>();
	const { address } = useAccount();
	const router = useRouter();

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

	const settingsPath = () => {
		router.push('/ads/settings');
	};

	const createAddPath = () => {
		router.push('/sell');
	};

	return (
		<div className="py-6">
			<div className="flex flex-col mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
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
				<ListsTable lists={lists} />
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async () => ({
	props: { title: 'My Ads' }
});

export default Ads;
