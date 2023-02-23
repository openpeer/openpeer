import { Loading, WrongNetwork } from 'components';
import { DisputeClaim, DisputeNotes, DisputeStatus } from 'components/DisputeTrade/';
import { useConnection } from 'hooks';
import { Order } from 'models/types';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const Dispute = ({ id }: { id: `0x${string}` }) => {
	const [order, setOrder] = useState<Order>();
	const { wrongNetwork, status } = useConnection();
	const { address } = useAccount();

	useEffect(() => {
		fetch(`/api/orders/${id}`)
			.then((res) => res.json())
			.then((data) => {
				setOrder(data);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	if (wrongNetwork) return <WrongNetwork />;
	if (status === 'loading' || !order) return <Loading />;

	const { token_amount: tokenAmount, list, buyer } = order;
	const { token, seller } = list;
	const isSeller = address === seller.address;
	const isBuyer = address === buyer.address;

	if (!isSeller && !isBuyer) return <Loading />;

	return (
		<div className="p-4 md:p-6 w-full m-auto mb-16">
			<div className="p-8 bg-white rounded-lg border border-slate-200 w-full flex flex-col md:flex-row md:gap-x-10">
				<div className="w-full md:w-1/2">
					<div className="flex flex-row pb-1 mb-4 text-cyan-600 text-xl">
						<Image
							src={token.icon}
							alt={token.symbol}
							className="h-6 w-6 flex-shrink-0 rounded-full"
							width={24}
							height={24}
						/>
						<div className="pl-2">
							{isBuyer ? 'Buy' : 'Sell'} {tokenAmount} {token.symbol}
						</div>
					</div>
					<span>
						<DisputeClaim />
					</span>
					<span className="hidden">
						<DisputeStatus />
					</span>
				</div>
				<DisputeNotes />
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) => {
	// Pass data to the page via props
	return { props: { title: 'Dispute Trade', id: String(context.params?.id) } };
};
export default Dispute;
