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
			<label htmlFor="buyOrder">
				<span className="font-bold text-gray-800">{title}</span>
				<p id="order-description" className="font-medium text-gray-500">
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
			<h2 className="text-lg mt-12 mb-2">Choose order type</h2>
			<fieldset className="mb-2">
				<Option
					type="SellList"
					title="Sell Order"
					description="I want to sell crypto in exchange for fiat"
					onClick={setType}
					selected={type === 'SellList'}
				/>
				<Option
					type="BuyList"
					title="Buy Order"
					description="I want to buy crypto in exchange for fiat"
					onClick={setType}
					selected={type === 'BuyList'}
				/>
			</fieldset>

			{type === 'SellList' && (
				<div>
					<h2 className="text-lg mt-6 mb-2">Choose Sell order type</h2>
					<fieldset className="mb-4">
						<Option
							type="SellInstant"
							title="Instant Escrow (recommended)"
							description="I want to hold funds in OpenPeer and have them escrowed instantly when an order is placed"
							onClick={setType}
							selected={type === 'SellInstant'}
						/>
						<Option
							type="SellManual"
							title="Manual Escrow"
							description="I want to move funds to OpenPeer and manually escrow when an order is placed. Ideal if you want to hold funds on Binance and only move to OpenPeer 
						when an order is placed"
							onClick={setType}
							selected={type === 'SellManual'}
						/>
					</fieldset>
				</div>
			)}
		</StepLayout>
	);
};

export default ListType;
