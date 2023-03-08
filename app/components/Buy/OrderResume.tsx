import Button from 'components/Button/Button';
import { formatUnits } from 'ethers/lib/utils.js';
import { useEscrowFee } from 'hooks';
import { Order } from 'models/types';
import { useAccount } from 'wagmi';

import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';

import ClipboardText from './ClipboardText';

interface OrderResumeParams {
	order: Order;
	showRating?: boolean;
}

const OrderResume = ({ order, showRating = false }: OrderResumeParams) => {
	const { list, token_amount: tokenAmount, fiat_amount: fiatAmount, escrow, id, created_at: createdAt } = order;
	const { token, seller, fiat_currency: currency } = list!;
	const { address } = useAccount();
	const selling = seller.address === address;

	const tokenValue = `${tokenAmount} ${token.symbol}`;
	const fiatValue = `${currency.symbol} ${Number(fiatAmount).toFixed(2)}`;
	const { fee } = useEscrowFee({ address: escrow?.address, token, tokenAmount });
	const date = new Date(createdAt);

	return (
		<div className="w-full bg-white rounded-lg border border-color-gray-100 p-6">
			<div className="flex flex-row justify-between mb-4">
				<span className="text-[#6A6A6A]">Amount Paid</span>
				<span className="flex flex-row justify-between">{selling ? tokenValue : fiatValue}</span>
			</div>
			{selling && !!fee && (
				<div className="flex flex-row justify-between mb-4">
					<span className="text-[#6A6A6A]">Fee Paid</span>
					<span className="flex flex-row justify-between">{`${formatUnits(fee, token.decimals)} ${
						token.symbol
					}`}</span>
				</div>
			)}

			<div className="flex flex-row justify-between mb-4">
				<span className="text-[#6A6A6A]">Amount Received</span>
				<span className="flex flex-row justify-between">{selling ? fiatValue : tokenValue}</span>
			</div>
			<div className="flex flex-row justify-between mb-4">
				<span className="text-[#6A6A6A]">Order Time</span>
				<span className="flex flex-row justify-between">
					{date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
				</span>
			</div>
			<div className="flex flex-row justify-between mb-4">
				<span className="text-[#6A6A6A]">Reference No.</span>
				<span className="flex flex-row justify-between">
					<ClipboardText itemValue={String(Number(id) * 10000)} />
				</span>
			</div>
			{showRating && false && (
				<>
					<div className="border-bottom border border-color-gray-200 mb-4"></div>
					<div className="flex flex-row items-center justify-between">
						<span className="text-[#6A6A6A]">Rate {selling ? 'buyer' : 'merchant'}</span>
						<span className="w-1/2">
							<div className="flex flex-col flex-col-reverse md:flex-row items-center">
								<span className="w-full md:pr-8">
									<Button
										title={
											<>
												<div className="flex flex-row items-center justify-center">
													<HandThumbUpIcon className="w-6" />
													<span className="ml-2">Good</span>
												</div>
											</>
										}
										outlined
									/>
								</span>
								<span className="w-full">
									<Button
										title={
											<>
												<div className="flex flex-row items-center justify-center">
													<HandThumbDownIcon className="w-6" />
													<span className="ml-2">Bad</span>
												</div>
											</>
										}
										outlined
									/>
								</span>
							</div>
						</span>
					</div>
				</>
			)}
		</div>
	);
};

export default OrderResume;
