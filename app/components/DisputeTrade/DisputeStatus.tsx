import Button from 'components/Button/Button';
import CancelOrderButton from 'components/Buy/CancelOrderButton/CancelOrderButton';
import ReleaseFundsButton from 'components/Buy/ReleaseFundsButton';
import Label from 'components/Label/Label';
import { formatUnits } from 'ethers/lib/utils.js';
import { useEscrowFee } from 'hooks';
import { Order } from 'models/types';
import Image from 'next/image';
import { smallWalletAddress } from 'utils';

import StatusTimeLine from './StatusTimeLine';

interface DisputeStatusParams {
	order: Order;
	address: `0x${string}`;
}

const DisputeStatus = ({ order, address }: DisputeStatusParams) => {
	const {
		id,
		token_amount: tokenAmount,
		fiat_amount: fiatAmount,
		dispute,
		buyer,
		created_at: createdAt,
		list: {
			seller,
			token,
			fiat_currency: currency,
			payment_method: { bank }
		}
	} = order;
	const { resolved, winner } = dispute!;

	const isBuyer = address === buyer.address;
	const tokenValue = `${tokenAmount} ${token.symbol}`;
	const fiatValue = `${currency.symbol} ${Number(fiatAmount).toFixed(2)}`;
	const counterpart = isBuyer ? 'merchant' : 'buyer';
	const { fee } = useEscrowFee({ address: order?.escrow?.address, token, tokenAmount });
	const date = new Date(createdAt);

	return (
		<div>
			<div className="flex flex-col border-b pb-4">
				{!resolved ? (
					<div className="flex flex-row justify-between">
						<div className="font-bold">Dispute Pending</div>
						<div className="text-cyan-600 hidden">
							Time left <span>15m:20secs</span>
						</div>
					</div>
				) : !!winner && winner.address === address ? (
					<div className="text-cyan-600">
						<div className="font-bold">Dispute Ended</div>
						Congratulations. You won the dispute. {tokenValue} and the fee has been credited to your account
					</div>
				) : (
					<div className="text-red-600">
						<div className="font-bold">Dispute Ended</div>
						Unfortunately, You lost the dispute. {tokenValue} has been credited back to the {counterpart}
						&apos;s account
					</div>
				)}
			</div>

			<div className="py-8">
				<StatusTimeLine escrow={order.escrow!.address} dispute={dispute!} isBuyer={isBuyer} />
			</div>

			<div>
				<Label title="Transaction Details" />
				<div className="text-sm mt-4">
					<div className="flex flex-row justify-between mb-2">
						<span className="text-gray-500">Merchant</span>
						<span>{seller.name || smallWalletAddress(seller.address, 10)}</span>
					</div>
					<div className="flex flex-row justify-between mb-2">
						<span className="text-gray-500">Buyer</span>
						<span>{buyer.name || smallWalletAddress(buyer.address, 10)}</span>
					</div>
					<div className="flex flex-row justify-between mb-2">
						<span className="text-gray-500">Amount Paid</span>
						<span>{isBuyer ? fiatValue : tokenValue}</span>
					</div>
					{!isBuyer && !!fee && (
						<div className="flex flex-row justify-between mb-2">
							<span className="text-gray-500">Fee</span>
							<span>
								{formatUnits(fee)} {token.symbol}
							</span>
						</div>
					)}
					<div className="flex flex-row justify-between mb-2">
						<span className="text-gray-500">Amount to Receive</span>
						<span>{isBuyer ? tokenValue : fiatValue}</span>
					</div>
					<div className="flex flex-row justify-between mb-2">
						<span className="text-gray-500">Order Time</span>
						<span>
							{date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
						</span>
					</div>
					<div className="flex flex-row justify-between mb-2">
						<span className="text-gray-500">Reference No.</span>
						<span>{Number(id) * 10000}</span>
					</div>
					<div className="flex flex-row justify-between mb-2">
						<span className="text-gray-500">Payment Method</span>
						<span className="flex flex-row items-center">
							<Image
								src={bank.icon}
								alt={bank.name}
								className="h-6 w-6 flex-shrink-0 rounded-full mr-1"
								width={24}
								height={24}
								unoptimized
							/>
							{bank.name}
						</span>
					</div>
				</div>
			</div>

			{!resolved && (
				<div className="mt-8">
					{isBuyer ? (
						<CancelOrderButton order={order} title="Close Dispute" outlined={false} />
					) : (
						<ReleaseFundsButton escrow={order.escrow!.address} title="Close Dispute" />
					)}
				</div>
			)}
		</div>
	);
};

export default DisputeStatus;
