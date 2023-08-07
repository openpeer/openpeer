import { ListsTable, Loading } from 'components';
import { List } from 'models/types';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const Ads = () => {
	const [lists, setLists] = useState<List[]>();
	const { address } = useAccount();

	useEffect(() => {
		if (!address) return;

		fetch(`/api/lists?seller=${address}`)
			.then((res) => res.json())
			.then((data) => {
				setLists(data.data);
			});
	}, [address]);

	if (lists === undefined) {
		return <Loading />;
	}

	return (
		<div className="py-6">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
				<ListsTable lists={lists} />
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async () => ({
	props: { title: 'My Ads' }
});

export default Ads;
