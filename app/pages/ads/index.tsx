import { ListsTable, Loading, WrongNetwork } from 'components';
import { List } from 'models/types';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { polygon } from 'wagmi/chains';

const Ads = () => {
	const [lists, setLists] = useState<List[]>();
	const { chain, chains } = useNetwork();
	const { address } = useAccount();
	const chainId = chain?.id || chains[0]?.id || polygon.id;
	const { data: session } = useSession();

	useEffect(() => {
		if (!address) return;

		fetch(`/api/lists?chain_id=${chainId}&seller=${address}`)
			.then((res) => res.json())
			.then((data) => {
				setLists(data.data);
			});
	}, [address, chainId]);

	// @ts-expect-error
	if (address === undefined || !session || session.address !== address) {
		return <WrongNetwork />;
	}

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
