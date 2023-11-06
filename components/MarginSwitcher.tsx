import React, { useState } from 'react';

import { FiatCurrency, List, PriceSource, Token } from '../models/types';
import Loading from './Loading/Loading';
import Selector from './Selector';
import Label from './Label/Label';
import Select from './Select/Select';
import { Option as OptionModel } from './Select/Select.types';

interface Props {
	selected: List['margin_type'];
	onSelect: (opt: List['margin_type']) => void;
	margin: number | undefined;
	token: Token;
	currency: FiatCurrency;
	updateMargin: (n: number) => void;
	error?: string;
	price: number | undefined;
	listPriceSource: PriceSource | undefined;
	onUpdatePriceSource: (ps: PriceSource) => void;
}

interface OptionPriceSource extends OptionModel {
	api_id: PriceSource;
}

const priceSources: OptionPriceSource[] = [
	{
		id: 0,
		api_id: 'coingecko',
		name: 'Coingecko',
		icon: ''
	},
	{
		id: 1,
		api_id: 'binance_median',
		name: 'Binance P2P Median Price',
		icon: ''
	},
	{
		id: 2,
		api_id: 'binance_min',
		name: 'Binance P2P Min Price',
		icon: ''
	},
	{
		id: 3,
		api_id: 'binance_max',
		name: 'Binance P2P Max Price',
		icon: ''
	}
];

const Option = ({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: Props['onSelect'] }) => (
	<button
		type="button"
		className={`w-full flex justify-center rounded-full py-2 ${selected && 'bg-white text-black'}`}
		onClick={() => onSelect(label.toLowerCase() as List['margin_type'])}
	>
		{label}
	</button>
);

const MarginSwitcher = ({
	selected,
	onSelect,
	margin,
	currency,
	token,
	updateMargin,
	error,
	price,
	listPriceSource,
	onUpdatePriceSource
}: Props) => {
	const [priceSource, setPriceSource] = useState<PriceSource>(listPriceSource || currency.default_price_source);
	const selectPriceSource = (ps: OptionPriceSource) => {
		setPriceSource(ps.api_id);
		onUpdatePriceSource(ps.api_id);
	};

	return (
		<>
			<div className="w-full flex flex-col rounded-full bg-gray-100 mb-4">
				<div className="flex p-1.5 items-center text-neutral-500 font-bold">
					<Option label="Fixed" selected={selected === 'fixed'} onSelect={onSelect} />
					<Option
						label="Floating"
						selected={selected === 'percentage'}
						onSelect={() => onSelect('percentage')}
					/>
				</div>
			</div>
			<Label title={selected === 'fixed' ? 'Price' : 'Margin (% above market)'} />
			<>
				{selected === 'fixed' &&
					(margin === undefined ? (
						<Loading big={false} />
					) : (
						<Selector
							value={margin}
							suffix={` ${currency.name} per ${token.name}`}
							updateValue={updateMargin}
							error={error}
							decimals={3}
						/>
					))}
				{selected === 'percentage' && (
					<Selector value={margin!} suffix="%" updateValue={updateMargin} error={error} allowNegative />
				)}

				{currency.allow_binance_rates && token.allow_binance_rates && (
					<Select
						label="Market Price Source"
						options={priceSources}
						selected={priceSources.find((p) => p.api_id === priceSource)}
						onSelect={(o) => selectPriceSource(o as OptionPriceSource)}
					/>
				)}

				<div className="text-xl font-bold text-center mb-4">
					<h1>{price ? `Market Price: ${price} ${currency.name}` : ''}</h1>
				</div>
			</>
		</>
	);
};

export default MarginSwitcher;
