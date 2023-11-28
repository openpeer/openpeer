import { OpenPeerEscrow } from 'abis';
import { DisputeForm, DisputeNotes, DisputeStatus } from 'components/DisputeTrade/';
import Loading from 'components/Loading/Loading';
import Token from 'components/Token/Token';
import { Order } from 'models/types';
import React from 'react';
import { formatUnits } from 'viem';
import useAccount from 'hooks/useAccount';
import { useContractRead, useNetwork } from 'wagmi';

interface DisputeParams {
	order: Order;
}

const Dispute = ({ order }: DisputeParams) => {
	const { address } = useAccount();
	const { chain } = useNetwork();
	const escrowAddress = order?.escrow?.address;
	const { data: paidForDispute }: { data: boolean | undefined } = useContractRead({
		address: escrowAddress,
		abi: OpenPeerEscrow,
		functionName: 'disputePayments',
		args: [order.trade_id, address],
		watch: true,
		enabled: !!escrowAddress
	});

	const { data: disputeFee }: { data: bigint | undefined } = useContractRead({
		address: escrowAddress,
		abi: OpenPeerEscrow,
		functionName: 'disputeFee',
		enabled: !!escrowAddress
	});

	const { token_amount: tokenAmount, list, buyer, dispute, seller } = order;
	const { token } = list;
	const isSeller = address === seller.address;
	const isBuyer = address === buyer.address;

	if ((!isSeller && !isBuyer) || paidForDispute === undefined || chain === undefined || disputeFee === undefined) {
		return <Loading />;
	}

	const { user_dispute: userDispute, resolved } = dispute || {};
	const fee = `${formatUnits(disputeFee, chain.nativeCurrency.decimals)} ${chain.nativeCurrency.symbol}`;

	return (
		<div className="p-4 md:p-6 w-full m-auto mb-16">
			<div className="p-8 bg-white rounded-lg border border-slate-200 w-full flex flex-col md:flex-row md:gap-x-10">
				<div className="w-full md:w-1/2">
					<div className="flex flex-row pb-1 mb-4 text-cyan-600 text-xl">
						<Token token={token} size={24} />
						<div className="pl-2">
							{isBuyer ? 'Buy' : 'Sell'} {tokenAmount} {token.symbol}
						</div>
					</div>
					<span>
						{resolved || (!!userDispute && paidForDispute) ? (
							<DisputeStatus address={address} order={order} />
						) : (
							<DisputeForm address={address} order={order} paidForDispute={paidForDispute} fee={fee} />
						)}
					</span>
				</div>
				<DisputeNotes fee={fee} />
			</div>
		</div>
	);
};

export default Dispute;
