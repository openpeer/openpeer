import { ListsTable, Loading, Switcher } from 'components';
import { List } from 'models/types';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { polygon } from 'wagmi/chains';

const HomePage = () => {
	const [buyLists, setBuyLists] = useState<List[]>([]);
	const [sellLists, setSellLists] = useState<List[]>([]);
	const [lists, setLists] = useState<List[]>([]);
	const [isLoading, setLoading] = useState(false);
	const { chain, chains } = useNetwork();
	const chainId = chain?.id || chains[0]?.id || polygon.id;
	const { address } = useAccount();
	const [type, setType] = useState<string>('Sell');

	useEffect(() => {
		setLoading(true);
		fetch(`/api/lists?chain_id=${chainId}`)
			.then((res) => res.json())
			.then((data: List[]) => {
				const sell = data.filter((list) => list.type === 'SellList');
				const buy = data.filter((list) => list.type === 'BuyList');
				setSellLists(sell);
				setBuyLists(buy);
				setLists(sell);
				setLoading(false);
			});
	}, [chainId, address]);

	useEffect(() => {
		if (type === 'Buy') {
			setLists(buyLists);
		} else {
			setLists(sellLists);
		}
	}, [type, buyLists, sellLists]);

	if (isLoading) return <Loading />;
	if (!lists) return <p>No lists data</p>;

	return (
		<div className="py-6">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
				<Switcher leftLabel="Buy" rightLabel="Sell" selected={type} onToggle={setType} />
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
			title: 'Trade P2P'
		}
	};
};

export default HomePage;
