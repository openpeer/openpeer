const PreShowDetails = () => {
	return (
		<div className="w-full bg-white rounded-lg border border-color-gray-100 p-6">
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
			<div className="border-b-2 border-dashed border-color-gray-400 mb-4 mt-4"></div>
			<div className="flex flex-row justify-between">
				<span className="text-neutral-500 text-sm">Payment will expire in </span>
				<span className="flex flex-row justify-between">
					<span className="text-cyan-600 text-sm">15m:20secs</span>
				</span>
			</div>
		</div>
	);
};

export default PreShowDetails;
