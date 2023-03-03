import { OpenPeerEscrow } from 'abis';
import { DisputeForm, DisputeNotes, DisputeStatus } from 'components/DisputeTrade/';
import Loading from 'components/Loading/Loading';
import { Order } from 'models/types';
import Image from 'next/image';
import { useAccount, useContractRead } from 'wagmi';

interface DisputeParams {
	order: Order;
}

const Dispute = ({ order }: DisputeParams) => {
	const { address } = useAccount();
	const escrowAddress = order?.escrow?.address;
	const { data: paidForDispute }: { data: boolean | undefined } = useContractRead({
		address: escrowAddress,
		abi: OpenPeerEscrow,
		functionName: 'paidForDispute',
		args: [address],
		watch: true
	});

	const { token_amount: tokenAmount, list, buyer, dispute } = order;
	const { token, seller } = list;
	const isSeller = address === seller.address;
	const isBuyer = address === buyer.address;

	if ((!isSeller && !isBuyer) || paidForDispute === undefined) return <Loading />;

	const { user_dispute: userDispute } = dispute || {};
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
						{!!userDispute && paidForDispute ? (
							<DisputeStatus address={address} order={order} />
						) : (
							<DisputeForm address={address} order={order} paidForDispute={paidForDispute} />
						)}
					</span>
				</div>
				<DisputeNotes />
			</div>
		</div>
	);
};

export default Dispute;
