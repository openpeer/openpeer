import { ClipboardDocumentIcon, ClockIcon } from '@heroicons/react/20/solid';
import Button from 'components/Button/Button';
import { StepProps } from 'components/Listing/Listing.types';
import StepLayout from 'components/Listing/StepLayout';
import HeaderH2 from 'components/SectionHeading/h2';
import CopyPastListItem from './CopyPastListItem';

const Payment = ({ list, updateList }: StepProps) => {
	const { terms } = list;
	const onProceed = () => {
		updateList({ ...list, ...{ step: list.step + 1 } });
	};

	return (
		<>
			<StepLayout>
				<div className="my-8">
					<div className="">
						<span className="flex flex-row text-yellow-600 mb-2">
							<ClockIcon className="w-8 mr-2" />
							<HeaderH2 title="Awaiting Merchant Approval" />
						</span>
						<p className="text-base">
							Kindly wait for the merchant to accept the order and escrow their funds. Payments details
							will become visible as soon as merchant accepts.
						</p>
					</div>
					<div className="hidden">
						<span className="flex flex-row mb-2">
							<HeaderH2 title="Pay Merchant" />
						</span>
						<p className="text-base">
							Proceed to your bank app or payment platform and send the required amount to the bank
							account details below.
						</p>
					</div>
					<div className="hidden">
						<span className="flex flex-row text-yellow-600 mb-2">
							<ClockIcon className="w-8 mr-2" />
							<HeaderH2 title="Awaiting Release" />
						</span>
						<p className="text-base">
							This payment has been marked as paid. Awaiting comfirmation from the merchant and the
							release of 159USDT.
						</p>
					</div>
					<div className="flex flex-row justify-around bg-gray-100 rounded-lg p-6 my-4">
						<div className="flex flex-col">
							<span className="text-sm">Amount to pay</span>
							<span className="text-xl">INR₹159</span>
						</div>
						<div className="flex flex-col">
							<span className="text-sm">Price</span>
							<span className="text-xl">INR₹1,000</span>
						</div>
						<div className="flex flex-col">
							<span className="text-sm">Amount to receive</span>
							<span className="text-xl">159 USDT</span>
						</div>
					</div>

					<div className="w-full bg-white rounded-lg border border-color-gray-100 p-6">
						<div className="flex flex-row justify-between mb-4">
							<span className="text-[#6A6A6A]">Account Name</span>
							<CopyPastListItem itemValue="Josh Reyes" />
						</div>
						<div className="flex flex-row justify-between mb-4">
							<span className="text-[#6A6A6A]">Account Number</span>
							<span className="flex flex-row justify-between">
								<CopyPastListItem itemValue="011223332222" />
							</span>
						</div>
						<div className="flex flex-row justify-between mb-4">
							<span className="text-[#6A6A6A]">Bank Name</span>
							<span className="flex flex-row justify-between">
								<CopyPastListItem itemValue="Revolut" />
							</span>
						</div>
						<div className="flex flex-row justify-between mb-4">
							<span className="text-[#6A6A6A]">Reference No.</span>
							<span className="flex flex-row justify-between">
								<CopyPastListItem itemValue="011223332222" />
							</span>
						</div>
						<div className="border-bottom border border-color-gray-200 mb-4"></div>
						<div className="flex flex-row justify-between">
							<span className="text-[#6A6A6A]">Payment will expire in </span>
							<span className="flex flex-row justify-between">
								<span className="text-[#3C9AAA]">15m:20secs</span>
							</span>
						</div>
					</div>
					<div className="flex flex-col flex-col-reverse md:flex-row items-center justify-between mt-8 md:mt-0">
						<span className="w-full md:w-1/2 md:pr-8">
							<Button title="Cancel Order" outlined />
						</span>
						<span className="w-full">
							<Button title="I’ve made the payment" onClick={onProceed} />
						</span>
					</div>
				</div>
			</StepLayout>
		</>
	);
};

export default Payment;
