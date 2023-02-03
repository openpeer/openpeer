import { Input, Label, MarginSwitcher } from 'components';
import { List } from 'models/types';
import { useEffect, useState } from 'react';

import { ListStepProps } from './Listing.types';
import StepLayout from './StepLayout';

const Amount = ({ list, updateList }: ListStepProps) => {
	const {
		token,
		currency,
		totalAvailableAmount,
		limitMin,
		limitMax,
		marginType = 'fixed',
		margin: savedMargin
	} = list;

	const percentage = marginType === 'percentage';
	const [percentageMargin, setPercentageMargin] = useState<number>(percentage ? savedMargin || 5 : 5);
	const [fixedMargin, setFixedMargin] = useState<number | undefined>(percentage ? undefined : savedMargin);
	const [price, setPrice] = useState<number | undefined>();

	const margin = percentage ? percentageMargin : fixedMargin;
	const updateMargin = (m: number) => {
		percentage ? setPercentageMargin(m) : setFixedMargin(m);
		updateList({ ...list, ...{ margin: m } });
	};

	const onProceed = () => {
		const total = totalAvailableAmount || 0;
		const min = limitMin || 0;
		const max = limitMax || 0;
		if (total > 0 && min <= max && ((margin || 0) > 0 || percentage)) {
			updateList({ ...list, ...{ step: list.step + 1 } });
		}
	};

	const onSelectType = (t: List['margin_type']) => {
		const m = t === 'fixed' ? fixedMargin : percentageMargin;
		updateList({ ...list, ...{ marginType: t, margin: m } });
	};

	useEffect(() => {
		fetch(
			`https://api.coingecko.com/api/v3/simple/price?ids=${
				token!.coingecko_id
			}&vs_currencies=${currency!.name.toLowerCase()}`
		)
			.then((res) => res.json())
			.then((data) => {
				setPrice(data[token!.coingecko_id!][currency!.name.toLowerCase()]);
			});
	}, [token, currency]);

	useEffect(() => {
		if (price) {
			if (fixedMargin === undefined) {
				setFixedMargin(price);
				if (!percentage) updateMargin(price);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fixedMargin, percentage, price]);

	return (
		<StepLayout onProceed={onProceed}>
			<Input
				label="Enter total available crypto amount"
				error="Ops, type your name"
				addOn={token!.name}
				id="price"
				value={totalAvailableAmount}
				onChangeNumber={(n) => updateList({ ...list, ...{ totalAvailableAmount: n } })}
				type="decimal"
				required
			/>
			<div>
				<Label title="Enter fiat order limit" />
				<div className="flex flex-row gap-x-8 -mt-6">
					<Input
						placeholder="100"
						label="Min:"
						addOn={currency!.name}
						id="minPrice"
						type="decimal"
						value={limitMin}
						onChangeNumber={(n) => updateList({ ...list, ...{ limitMin: n } })}
					/>
					<Input
						placeholder="1000"
						label="Max:"
						addOn={currency!.name}
						id="maxPrice"
						type="decimal"
						value={limitMax}
						onChangeNumber={(n) => updateList({ ...list, ...{ limitMax: n } })}
					/>
				</div>
			</div>

			<Label title="Set Price Margin" />
			<MarginSwitcher
				selected={marginType}
				onSelect={onSelectType}
				currency={currency!.name}
				token={token!.name}
				margin={margin}
				updateMargin={updateMargin}
			/>

			<div className="w-full flex flex-row justify-between mb-8 hidden">
				<div>
					<div>Lowest price</div>
					<div className="text-xl font-bold">25.9 {currency!.name}</div>
				</div>
				<div>
					<div>Highest price</div>
					<div className="text-xl font-bold">25.9 {currency!.name}</div>
				</div>
			</div>
		</StepLayout>
	);
};

export default Amount;
