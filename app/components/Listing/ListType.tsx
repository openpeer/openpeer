import { useState } from 'react';

import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from '@heroicons/react/20/solid';

import { ListStepProps, UIList } from './Listing.types';
import StepLayout from './StepLayout';

const ListType = ({ updateList, list }: ListStepProps) => {
	const [type, setType] = useState<UIList['type']>(list.type);

	const onProceed = () => {
		updateList({ ...list, ...{ type, step: list.step + 1 } });
	};

	return (
		<StepLayout onProceed={onProceed}>
			<h2 className="text-xl mt-8 mb-2">Choose the order type</h2>
			<p>Choose if you want to sell or buy crypto</p>
			<fieldset className="border-t border-b border-gray-200">
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
								aria-describedby="buy-order"
								type="radio"
								className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
								value="BuyList"
								checked={type === 'BuyList'}
								onChange={(e) => setType(e.target.value as UIList['type'])}
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
								aria-describedby="sell-order"
								type="radio"
								value="SellList"
								className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
								checked={type === 'SellList'}
								onChange={(e) => setType(e.target.value as UIList['type'])}
							/>
						</div>
					</div>
				</div>
			</fieldset>
		</StepLayout>
	);
};

export default ListType;
