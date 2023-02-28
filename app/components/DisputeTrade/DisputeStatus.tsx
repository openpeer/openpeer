import Button from 'components/Button/Button';
import Label from 'components/Label/Label';
import { Order } from 'models/types';

import StatusTimeLine from './StatusTimeLine';

const DisputeStatus = ({ order, address }: { order: Order; address: `0x${string}` }) => {
	const {
		dispute: { resolved, winner }
	} = order;
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
						Congratulations. You won the dispute. 158 USDT has been credited to your account
					</div>
				) : (
					<div className="text-red-600">
						<div className="font-bold">Dispute Ended</div>
						Unfortunately, You lost the dispute. 158 USDT has been credited back to the merchant’s account
					</div>
				)}
			</div>

			<div className="py-8">
				<StatusTimeLine />
			</div>

			<div>
				<Label title="Transaction Details" />
				<div className="text-sm mt-4">
					<div className="flex flex-row justify-between mb-2">
						<span className="text-gray-500">Merchant</span>
						<span>Real_Trader</span>
					</div>
					<div className="flex flex-row justify-between mb-2">
						<span className="text-gray-500">Amount Paid</span>
						<span>INR₹159</span>
					</div>
					<div className="flex flex-row justify-between mb-2">
						<span className="text-gray-500">Amount to Receive</span>
						<span>159 USDT</span>
					</div>
					<div className="flex flex-row justify-between mb-2">
						<span className="text-gray-500">Order Time</span>
						<span>11:00am, 12/11/2022</span>
					</div>
					<div className="flex flex-row justify-between mb-2">
						<span className="text-gray-500">Reference No.</span>
						<span>011223332222</span>
					</div>
					<div className="flex flex-row justify-between mb-2">
						<span className="text-gray-500">Payment Method</span>
						<span>[IMG]</span>
					</div>
				</div>
			</div>

			<div className="mt-8">
				<Button title="Close Dispute" />
			</div>
		</div>
	);
};

export default DisputeStatus;
