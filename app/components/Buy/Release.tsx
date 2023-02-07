import Button from 'components/Button/Button';
import StepLayout from 'components/Listing/StepLayout';
import HeaderH2 from 'components/SectionHeading/h2';
import { useAccount } from 'wagmi';

import { ClockIcon } from '@heroicons/react/24/outline';

import { BuyStepProps } from './Buy.types';
import ClipboardText from './ClipboardText';

const Release = ({ order, updateOrder }: BuyStepProps) => {
	const onProceed = () => {
		updateOrder({ ...order, ...{ step: order.step + 1 } });
	};
	const { address } = useAccount();

	const { tokenAmount, list, fiatAmount } = order;
	const { token, fiat_currency: currency } = list || {};
	const seller = list?.seller.address === address;

	return (
		<>
			<StepLayout>
				<div className="my-8">
					<div className="mb-4">
						<span className="flex flex-row text-yellow-600 mb-2">
							<ClockIcon className="w-8 mr-2" />
							<HeaderH2 title="Awaiting Release" />
						</span>
						<p className="text-base">
							This payment has been marked as paid. Awaiting confirmation from the merchant and the
							release of {tokenAmount} {token?.name}.
						</p>
					</div>

					<div className="w-full bg-white rounded-lg border border-color-gray-100 p-6">
						<div className="flex flex-row justify-between mb-4">
							<span className="text-[#6A6A6A]">Amount Paid</span>
							<span className="flex flex-row justify-between">
								{currency?.symbol} {fiatAmount}
							</span>
						</div>

						<div className="flex flex-row justify-between mb-4">
							<span className="text-[#6A6A6A]">Amount Received</span>
							<span className="flex flex-row justify-between">
								{tokenAmount} {token?.name}
							</span>
						</div>
						<div className="flex flex-row justify-between mb-4 hidden">
							<span className="text-[#6A6A6A]">Order Time</span>
							<span className="flex flex-row justify-between">11:00am, 12/11/2022</span>
						</div>
						<div className="flex flex-row justify-between mb-4 hidden">
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
					<div className="flex flex-col flex-col-reverse md:flex-row items-center justify-between mt-8 md:mt-0">
						<span className="w-full md:pr-8">
							<Button title="Dispute Transaction" outlined />
						</span>
						<span className="w-full">
							{seller ? (
								<Button title="Release funds" onClick={onProceed} />
							) : (
								<Button title="Cancel Order" onClick={onProceed} />
							)}
						</span>
					</div>
				</div>
			</StepLayout>
		</>
	);
};

export default Release;
