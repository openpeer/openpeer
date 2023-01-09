import { ClockIcon } from '@heroicons/react/24/outline';
import Button from 'components/Button/Button';
import { StepProps } from 'components/Listing/Listing.types';
import StepLayout from 'components/Listing/StepLayout';
import HeaderH2 from 'components/SectionHeading/h2';
import ClipboardText from './ClipboardText';

const Release = ({ list, updateList }: StepProps) => {
	const { terms } = list;
	const onProceed = () => {
		updateList({ ...list, ...{ step: list.step + 1 } });
	};

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
							This payment has been marked as paid. Awaiting comfirmation from the merchant and the
							release of 159USDT.
						</p>
					</div>

					<div className="w-full bg-white rounded-lg border border-color-gray-100 p-6">
						<div className="flex flex-row justify-between mb-4">
							<span className="text-[#6A6A6A]">Amount Paid</span>
							<span className="flex flex-row justify-between">INR₹159</span>
						</div>

						<div className="flex flex-row justify-between mb-4">
							<span className="text-[#6A6A6A]">Amount Received</span>
							<span className="flex flex-row justify-between">159 USDT</span>
						</div>
						<div className="flex flex-row justify-between mb-4">
							<span className="text-[#6A6A6A]">Order Time</span>
							<span className="flex flex-row justify-between">11:00am, 12/11/2022</span>
						</div>
						<div className="flex flex-row justify-between mb-4">
							<span className="text-[#6A6A6A]">Reference No.</span>
							<span className="flex flex-row justify-between">
								<ClipboardText itemValue="011223332222" />
							</span>
						</div>
						<div className="border-b-2 border-dashed border-color-gray-400 mb-4"></div>
						<div className="flex flex-row justify-between">
							<span className="text-[#6A6A6A]">Payment will expire in </span>
							<span className="flex flex-row justify-between">
								<span className="text-[#3C9AAA]">15m:20secs</span>
							</span>
						</div>
					</div>
					<div className="flex flex-col flex-col-reverse md:flex-row items-center justify-between mt-8 md:mt-0">
						<span className="w-full md:pr-8">
							<Button title="Cancel Order" outlined />
						</span>
						<span className="w-full">
							<Button title="Dispute Transaction" onClick={onProceed} />
						</span>
					</div>
				</div>
			</StepLayout>
		</>
	);
};

export default Release;
