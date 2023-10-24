import React from 'react';
import Countdown from 'react-countdown';

const PreShowDetails = ({ timeLeft }: { timeLeft: number }) => (
	<div className="w-full bg-white rounded-lg border border-color-gray-100 p-6">
		{timeLeft > 0 && (
			<div className="flex flex-row justify-between mb-4 border-bottom border-dashed">
				<span className="text-neutral-500">The order will be cancelled in</span>
				<span className="flex flex-row justify-between">
					<Countdown
						date={Date.now() + timeLeft}
						precision={2}
						renderer={({ hours, minutes, seconds, completed }) => {
							if (completed) {
								return <span>Time is up!</span>;
							}
							return (
								<span className="text-red-600">
									{hours > 0 ? `${hours}h:` : ''}
									{minutes}m:{seconds}secs
								</span>
							);
						}}
					/>
				</span>
			</div>
		)}
		<div className="blur-sm">
			<div className="flex flex-row justify-between mb-4">
				<span className="text-neutral-500">Account Name</span>
				<span className="flex flex-row justify-between">••••••</span>
			</div>
			<div className="flex flex-row justify-between mb-4">
				<span className="text-neutral-500">Account Number</span>
				<span className="flex flex-row justify-between">••••••••</span>
			</div>
			<div className="flex flex-row justify-between mb-4">
				<span className="text-neutral-500">Bank Name</span>
				<span className="flex flex-row justify-between">••••••••</span>
			</div>
			<div className="flex flex-row justify-between">
				<span className="text-neutral-500">Reference No.</span>
				<span className="flex flex-row justify-between">••••</span>
			</div>
		</div>
		<div className="border-b-2 border-dashed border-color-gray-400 mb-4 mt-4 hidden" />
		<div className="flex flex-row justify-between hidden">
			<span className="text-neutral-500 text-sm">Payment will expire in </span>
			<span className="flex flex-row justify-between">
				<span className="text-cyan-600 text-sm">14m:20secs</span>
			</span>
		</div>
	</div>
);

export default PreShowDetails;
