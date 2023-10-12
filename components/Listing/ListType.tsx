import React, { useState } from 'react';

import { ListStepProps, UIList } from './Listing.types';
import StepLayout from './StepLayout';

interface OptionProps {
	type: UIList['type'];
	title: string;
	description: string;
	selected: boolean;
	onClick: (type: UIList['type']) => void;
}

const Option = ({ type, title, description, selected, onClick }: OptionProps) => (
	<div
		className={`relative flex items-center p-4 cursor-pointer my-4 border rounded-lg ${
			selected ? ' border-gray-500' : ''
		}`}
		onClick={() => onClick(type)}
	>
		<div className="min-w-0 flex-1 text-sm pl-2">
			<label htmlFor="buyOrder" className="font-medium text-gray-700">
				{title}
				<p id="order-description" className="text-gray-500">
					{description}
				</p>
			</label>
		</div>
		<div className="ml-3 flex h-5 items-center">
			<input
				id={title}
				aria-describedby={title}
				type="radio"
				className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
				value={type}
				checked={selected}
			/>
		</div>
	</div>
);

const ListType = ({ updateList, list }: ListStepProps) => {
	const [type, setType] = useState<UIList['type']>(list.type || 'SellList');

	const onProceed = () => {
		updateList({ ...list, ...{ type } });
	};

	return (
		<StepLayout onProceed={onProceed}>
			<h2 className="text-xl mt-12 mb-2">Choose order type</h2>
			<fieldset className="mb-4">
				<Option
					type="BuyList"
					title="Buy Order"
					description="I want to buy crypto in exchange for fiat"
					onClick={setType}
					selected={type === 'BuyList'}
				/>
				<Option
					type="SellList"
					title="Sell Order"
					description="I want to sell crypto in exchange for fiat"
					onClick={setType}
					selected={type === 'SellList'}
				/>
			</fieldset>
		</StepLayout>
	);
};

export default ListType;
