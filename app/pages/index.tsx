import { ListsTable, Loading } from 'components';
import { List } from 'models/types';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { polygon } from 'wagmi/chains';

const HomePage = () => {
	const [lists, setLists] = useState<List[]>([]);
	const [isLoading, setLoading] = useState(false);
	const { chain, chains } = useNetwork();
	const chainId = chain?.id || chains[0]?.id || polygon.id;
	const { address } = useAccount();

	useEffect(() => {
		setLoading(true);
		fetch(`/api/lists?chain_id=${chainId}`)
			.then((res) => res.json())
			.then((data) => {
				setLists(data);
				setLoading(false);
			});
	}, [chainId, address]);

	if (isLoading) return <Loading />;
	if (!lists) return <p>No lists data</p>;

	return (
		<div className="py-6">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
				<div className="py-4">
					<ListsTable lists={lists} />
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	return {
		props: {
			title: 'P2P'
		}
	};
};

export default HomePage;
