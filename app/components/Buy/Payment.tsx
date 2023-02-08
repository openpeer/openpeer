import Button from 'components/Button/Button';
import StepLayout from 'components/Listing/StepLayout';
import HeaderH2 from 'components/SectionHeading/h2';
import { useAccount } from 'wagmi';

import { ClockIcon } from '@heroicons/react/24/outline';

import { BuyStepProps } from './Buy.types';
import ClipboardText from './ClipboardText';
import EscrowFundsButton from './EscrowFundsButton';
import MarkAsPaidButton from './MarkAsPaidButton';
import ReleaseFundsButton from './ReleaseFundsButton';

const Payment = ({ order, updateOrder }: BuyStepProps) => {
	const { list, fiat_amount: fiatAmount, token_amount: tokenAmount, price, uuid, buyer, status, escrow } = order;
	const { token, fiat_currency: currency, payment_method: paymentMethod } = list!;
	const { address } = useAccount();
	const seller = list?.seller.address === address;

	const onProceed = () => {
		updateOrder({ ...order, ...{ step: order.step + 1 } });
	};

	const onFinishedPayment = () => {};

	return (
		<StepLayout>
			<div className="my-8">
				{status === 'created' && (
					<div>
						<span className="flex flex-row mb-2 text-yellow-600">
							<ClockIcon className="w-8 mr-2" />
							<HeaderH2 title="Awaiting Merchant Deposit" />
						</span>
						<p className="text-base">
							{seller
								? 'Please deposit funds to escrow in order to confirm and complete this transaction.'
								: 'Kindly wait for the merchant to accept the order and escrow their funds. Payments details will become visible as soon as merchant escrow the funds. '}
						</p>
					</div>
				)}
				{status === 'escrowed' && (
					<div>
						<span className={`flex flex-row mb-2 ${!!seller && 'text-yellow-600'}`}>
							<HeaderH2 title={seller ? 'Awaiting Buyer Payment' : 'Pay Merchant'} />
						</span>
						<p className="text-base">
							{seller
								? 'Kindly wait for the buyer to pay. If the buyer already paid you can release the funds. Be careful.'
								: 'Proceed to your bank app or payment platform and send the required amount to the bank account details below.'}
						</p>
					</div>
				)}
				<div className="flex flex-row justify-around bg-gray-100 rounded-lg p-6 my-4">
					<div className="flex flex-col">
						<span className="text-sm">Amount to pay</span>
						<span className="text-xl">
							{seller
								? `${Number(tokenAmount)?.toFixed(2)} ${token.symbol}`
								: `${currency.symbol} ${fiatAmount}`}
						</span>
					</div>
					<div className="flex flex-col">
						<span className="text-sm">Price</span>
						<span className="text-xl">
							{currency.symbol} {price}
						</span>
					</div>
					<div className="flex flex-col">
						<span className="text-sm">Amount to receive</span>
						<span className="text-xl">
							{seller
								? `${currency.symbol} ${fiatAmount}`
								: `${Number(tokenAmount)?.toFixed(2)} ${token.symbol}`}
						</span>
					</div>
				</div>
				{status === 'escrowed' && (
					<div className="w-full bg-white rounded-lg border border-color-gray-100 p-6">
						<div className="flex flex-row justify-between mb-4">
							<span className="text-[#6A6A6A]">Account Name</span>
							<ClipboardText itemValue={paymentMethod.account_name} />
						</div>
						<div className="flex flex-row justify-between mb-4">
							<span className="text-[#6A6A6A]">Account Number</span>
							<span className="flex flex-row justify-between">
								<ClipboardText itemValue={paymentMethod.account_number} />
							</span>
						</div>
						<div className="flex flex-row justify-between mb-4">
							<span className="text-[#6A6A6A]">Bank Name</span>
							<span className="flex flex-row justify-between">
								<ClipboardText itemValue={paymentMethod.bank.name} />
							</span>
						</div>
						<div className="flex flex-row justify-between hidden">
							<span className="text-[#6A6A6A]">Reference No.</span>
							<span className="flex flex-row justify-between">
								<ClipboardText itemValue="011223332222" />
							</span>
						</div>
						<div className="border-b-2 border-dashed border-color-gray-400 mb-4 hidden"></div>
						<div className="flex flex-row justify-between hidden">
							<span className="text-[#6A6A6A]">Payment will expire in </span>
							<span className="flex flex-row justify-between">
								<span className="text-[#3C9AAA]">15m:20secs</span>
							</span>
						</div>
					</div>
				)}
				<div className="flex flex-col flex-col-reverse md:flex-row items-center justify-between mt-8 md:mt-0">
					<span className="w-full md:w-1/2 md:pr-8">
						<Button title="Cancel Order" outlined />
					</span>
					{status === 'created' && seller && (
						<EscrowFundsButton
							buyer={buyer!.address}
							token={token}
							tokenAmount={tokenAmount || 0}
							uuid={uuid!}
						/>
					)}
					{status === 'escrowed' && seller && !!escrow && <ReleaseFundsButton address={escrow.address} />}
					{status === 'escrowed' && !seller && !!escrow && (
						<MarkAsPaidButton escrowAddress={escrow.address} onFinished={onFinishedPayment} />
					)}
				</div>
			</div>
		</StepLayout>
	);
};

export default Payment;
