import React from 'react';

import { List } from '../models/types';
import Loading from './Loading/Loading';
import Selector from './Selector';

interface Props {
	selected: List['margin_type'];
	onSelect: (opt: List['margin_type']) => void;
	margin: number | undefined;
	token: string;
	currency: string;
	updateMargin: (n: number) => void;
	error?: string;
	price: number | undefined;
}

const Option = ({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: Props['onSelect'] }) => (
	<button
		type="button"
		className={`w-full flex justify-center rounded-full py-2 ${selected && 'bg-white text-black'}`}
		onClick={() => onSelect(label.toLowerCase() as List['margin_type'])}
	>
		{label}
	</button>
);

const MarginSwitcher = ({ selected, onSelect, margin, currency, token, updateMargin, error, price }: Props) => (
	<>
		<div className="w-full flex flex-col rounded-full bg-gray-100">
			<div className="flex p-1.5 items-center text-neutral-500 font-bold">
				<Option label="Fixed" selected={selected === 'fixed'} onSelect={onSelect} />
				<Option label="Percentage" selected={selected === 'percentage'} onSelect={onSelect} />
			</div>
		</div>
		<>
			{selected === 'fixed' &&
				(margin === undefined ? (
					<Loading big={false} />
				) : (
					<Selector
						value={margin}
						suffix={` ${currency} per ${token}`}
						underValue={price ? `Spot Price: ${price} ${currency}` : ''}
						updateValue={updateMargin}
						error={error}
					/>
				))}
			{selected === 'percentage' && (
				<Selector value={margin!} suffix="%" updateValue={updateMargin} error={error} allowNegative />
			)}
		</>
	</>
);

export default MarginSwitcher;
