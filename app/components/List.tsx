import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from '@heroicons/react/20/solid';

export default function List() {
	return (
		<>
			<fieldset className="border-t border-b border-gray-200">
				<legend className="sr-only">Notifications</legend>
				<div className="divide-y divide-gray-200">
					<div className="relative flex items-center py-4">
						<ArrowTrendingUpIcon className="h-5 w-" aria-hidden="true" />
						<div className="min-w-0 flex-1 text-sm pl-4">
							<label htmlFor="buyOrder" className="font-medium text-gray-700">
								Buy Order
								<p id="order-description" className="text-gray-500">
									Let users sell their crypto to you in exchange for fiat.
								</p>
							</label>
						</div>
						<div className="ml-3 flex h-5 items-center">
							<input
								id="buyOrder"
								aria-describedby="order-description"
								name="orderType"
								type="radio"
								className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
							/>
						</div>
					</div>
					<div className="relative flex items-center py-4">
						<ArrowTrendingDownIcon className="h-5 w-" aria-hidden="true" />
						<div className="min-w-0 flex-1 text-sm pl-4">
							<label htmlFor="sellOrder" className="font-medium text-gray-700">
								Sell Order
								<p id="order-description" className="text-gray-500">
									Let users buy crypto from you in exchange for fiat.
								</p>
							</label>
						</div>
						<div className="ml-3 flex h-5 items-center">
							<input
								id="sellOrder"
								aria-describedby="order-description"
								name="orderType"
								type="radio"
								className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
							/>
						</div>
					</div>
				</div>
			</fieldset>
		</>
	);
}
