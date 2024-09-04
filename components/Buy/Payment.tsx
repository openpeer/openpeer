import StepLayout from 'components/Listing/StepLayout';
import HeaderH3 from 'components/SectionHeading/h3';
import Image from 'next/image';
import React from 'react';
import { useAccount } from 'hooks';

import { ClockIcon } from '@heroicons/react/24/outline';

import Countdown from 'react-countdown';
import { useContractRead, useBalance } from 'wagmi';
import { OpenPeerEscrow } from 'abis';
import { BuyStepProps } from './Buy.types';
import CancelOrderButton from './CancelOrderButton/CancelOrderButton';
import ClipboardText from './ClipboardText';
import EscrowButton from './EscrowButton';
import MarkAsPaidButton from './MarkAsPaidButton';
import FeeDisplay from './Payment/FeeDisplay';
import PreShowDetails from './PreShowDetails';
import ReleaseFundsButton from './ReleaseFundsButton';

const Payment = ({ order }: BuyStepProps) => {
	const {
		list,
		fiat_amount: fiatAmount,
		token_amount: tokenAmount,
		price,
		uuid,
		buyer,
		escrow,
		id,
		status,
		seller,
		payment_method: paymentMethod,
		deposit_time_limit: depositTimeLimit,
		payment_time_limit: paymentTimeLimit,
		trade_id: tradeId
	} = order;
	const { token, fiat_currency: currency, escrow_type: escrowType } = list!;
	const { bank, values = {} } = paymentMethod;
	const { address } = useAccount();
	const selling = seller.address === address;

	const { data: escrowData } = useContractRead({
		address: escrow?.address,
		abi: OpenPeerEscrow,
		functionName: 'escrows',
		args: [tradeId]
	});

	const { data: balanceData } = useBalance({ address }); // Fetch wallet balance

	const timeLimit =
		status === 'created' && depositTimeLimit && Number(depositTimeLimit) > 0
			? Number(depositTimeLimit) * 60 * 1000
			: 0;

	const timeLeft = timeLimit - (new Date().getTime() - new Date(order.created_at).getTime());
	const instantEscrow = escrowType === 'instant';

	const [, sellerCanCancelAfter] = escrowData ? (escrowData as [boolean, bigint]) : [false, BigInt(0)];

	const sellerCanCancelAfterSeconds = parseInt(sellerCanCancelAfter.toString(), 10);
	const timeLimitForPayment =
		status === 'escrowed' && order.escrow && sellerCanCancelAfter && sellerCanCancelAfterSeconds > 0
			? sellerCanCancelAfterSeconds * 1000
			: 0;
	const paymentTimeLeft = timeLimitForPayment > 0 ? timeLimitForPayment - new Date().getTime() : 0;

	return (
		<StepLayout>
			<div className="my-0 md:my-8">
				{status === 'created' && instantEscrow && (
					<div>
						<span className="flex flex-row mb-2 text-yellow-600">
							<ClockIcon className="w-8 mr-2" />
							<HeaderH3 title="Instant Escrow" />
						</span>
						<p className="text-base">
							{selling
								? 'Please confirm the order. The funds will be locked in escrow as soon as you confirm the order. '
								: 'Please confirm the order. Payments details will become visible after the order confirmation. '}
						</p>
					</div>
				)}
				{status === 'created' && !instantEscrow && (
					<div>
						<span className="flex flex-row mb-2 text-yellow-600">
							<ClockIcon className="w-8 mr-2" />
							<HeaderH3 title="Awaiting Escrow Deposit" />
						</span>
						<p className="text-base">
							{selling
								? 'Please deposit funds to escrow in order to confirm and complete this transaction.'
								: 'Kindly wait for the seller to accept the order and escrow their funds. Payments details will become visible as soon as seller escrow the funds. '}
						</p>
					</div>
				)}
				{status === 'escrowed' && (
					<div>
						<span className="flex flex-row mb-2 text-yellow-600">
							<HeaderH3 title={selling ? 'Awaiting Buyer Payment' : 'Pay Seller'} />
						</span>
						<p className="text-base">
							{selling
								? 'Kindly wait for the buyer to pay. If the buyer already paid you can release the funds. Be careful.'
								: 'Proceed to your bank app or payment platform and send the required amount to the bank account details below.'}
						</p>
					</div>
				)}
				<div className="flex flex-col justify-around bg-gray-100 rounded-lg p-4 my-4">
					{selling ? (
						<FeeDisplay escrow={escrow?.address} token={token} tokenAmount={tokenAmount} />
					) : (
						<div className="flex flex-row items-center mb-1">
							<span className="text-sm mr-2">Amount to pay</span>
							<span className="text-base font-medium">
								{selling
									? `${tokenAmount} ${token.symbol}`
									: `${currency.symbol} ${Number(fiatAmount).toFixed(2)}`}
							</span>
						</div>
					)}
					<div className="flex flex-row items-center mb-1">
						<span className="text-sm mr-2">Price</span>
						<span className="text-base font-medium">
							{currency.symbol} {Number(price).toFixed(2)}
						</span>
					</div>
					<div className="flex flex-row items-center mb-1">
						<span className="text-sm mr-2">Amount to receive</span>
						<span className="text-base font-medium">
							{selling
								? `${currency.symbol} ${Number(fiatAmount).toFixed(2)}`
								: `${Number(tokenAmount)?.toFixed(2)} ${token.symbol}`}
						</span>
					</div>
					{status === 'created' && (
						<div className="flex flex-row items-center mb-1">
							<span className="text-sm mr-2">Payment Method</span>
							{bank.icon && (
								<Image
									src={bank.icon}
									alt={bank.name}
									className="h-6 w-6 flex-shrink-0 rounded-full mr-1"
									width={24}
									height={24}
									unoptimized
								/>
							)}
							<span className="text-base font-medium">{paymentMethod.bank.name}</span>
						</div>
					)}
				</div>

				{status === 'created' && !instantEscrow && <PreShowDetails timeLeft={timeLeft} />}
				{status === 'escrowed' && (
					<div className="w-full bg-white rounded-lg border border-color-gray-100 p-6 mb-4">
						<div className="flex flex-row justify-between mb-4">
							<span className="text-neutral-500">Payment Method</span>
							<span className="flex flex-row justify-between">
								{!!bank.icon && (
									<Image
										src={bank.icon}
										alt={bank.name}
										className="h-6 w-6 flex-shrink-0 rounded-full mr-1"
										width={24}
										height={24}
										unoptimized
									/>
								)}
								<ClipboardText itemValue={bank.name} />
							</span>
						</div>

						{Object.keys(values || {}).map((key) => {
							const {
								bank: { account_info_schema: schema }
							} = paymentMethod;
							const field = schema.find((f) => f.id === key);
							const value = (values || {})[key];
							if (!value) return <></>;

							return (
								<div className="flex flex-row justify-between mb-4" key={key}>
									<span className="text-neutral-500">{field?.label}</span>
									<ClipboardText itemValue={value} />
								</div>
							);
						})}
						<div className="flex flex-row justify-between">
							<span className="text-neutral-500">Reference No.</span>
							<span className="flex flex-row justify-between">
								<ClipboardText itemValue={String(Number(id) * 10000)} />
							</span>
						</div>
						{paymentTimeLeft > 0 && (
							<>
								<div className="border-b-2 border-dashed border-color-gray-400 mt-4 mb-4" />
								<div className="flex flex-row justify-between">
									<span className="text-neutral-500">The seller can cancel in </span>
									<span className="flex flex-row justify-between">
										<Countdown
											date={Date.now() + paymentTimeLeft}
											precision={2}
											renderer={({ hours, minutes, seconds, completed }) => {
												if (completed) {
													return <span className="text-cyan-600">Time is up!</span>;
												}
												return (
													<span className="text-cyan-600">
														{hours > 0 ? `${hours}h:` : ''}
														{minutes}m:{seconds}secs
													</span>
												);
											}}
										/>
									</span>
								</div>
							</>
						)}
					</div>
				)}

				{/* Add wallet balance and address display */}
				<div className="mt-4">
					<HeaderH3 title="Need to Top Up Your Wallet?" />
					<p className="text-base">
						<strong>Your Wallet Address:</strong> {address}
					</p>
					<p className="text-base">
						<strong>Your Wallet Balance:</strong> {balanceData?.formatted} {balanceData?.symbol}
					</p>
				</div>

				<div className="flex flex-col-reverse md:flex-row items-center justify-between mt-0">
					<span className="w-full md:w-1/2 md:pr-8">
						<CancelOrderButton order={order} />
					</span>
					{status === 'created' && (selling || instantEscrow) && (
						<EscrowButton
							buyer={buyer!.address}
							token={token}
							tokenAmount={tokenAmount || 0}
							uuid={uuid!}
							instantEscrow={instantEscrow}
							seller={seller.address}
							sellerWaitingTime={Number(paymentTimeLimit) * 60}
						/>
					)}
					{status === 'escrowed' &&
						!!escrow &&
						(selling ? (
							<ReleaseFundsButton order={order} dispute={false} />
						) : (
							<MarkAsPaidButton order={order} />
						))}
				</div>
			</div>
		</StepLayout>
	);
};

export default Payment;
