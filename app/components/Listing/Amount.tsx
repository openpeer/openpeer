import { Input, Label, MarginSwitcher } from 'components';
import { useFormErrors } from 'hooks';
import { Errors, Resolver } from 'models/errors';
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
	const [percentageMargin, setPercentageMargin] = useState<number>(percentage ? savedMargin || 1 : 1);
	const [fixedMargin, setFixedMargin] = useState<number | undefined>(percentage ? undefined : savedMargin);
	const [price, setPrice] = useState<number | undefined>();

	const { errors, clearErrors, validate } = useFormErrors();

	const margin = percentage ? percentageMargin : fixedMargin;

	const updateValue = (obj: any) => {
		clearErrors(Object.keys(obj));
		updateList({ ...list, ...obj });
	};

	const updateMargin = (m: number) => {
		clearErrors(['margin']);
		percentage ? setPercentageMargin(m) : setFixedMargin(m);
		updateValue({ margin: m });
	};

	const resolver: Resolver = () => {
		const total = totalAvailableAmount || 0;
		const min = limitMin || 0;
		const max = limitMax || 0;

		const error: Errors = {};

		if (total <= 0) {
			error.totalAvailableAmount = 'Should be bigger than 0';
		}

		if (min > max) {
			error.limitMin = 'Should be smaller than the max';
		}

		if (!percentage && (margin || 0) <= 0) {
			error.margin = 'Should be bigger than zero';
		}

		return error;
	};

	const onProceed = () => {
		if (validate(resolver)) {
			updateValue({ step: list.step + 1 });
		}
	};

	const onSelectType = (t: List['margin_type']) => {
		const m = t === 'fixed' ? fixedMargin : percentageMargin;
		updateValue({ marginType: t, margin: m });
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
				addOn={<span className="text-gray-500 sm:text-sm">{token!.name}</span>}
				id="totalAvailableAmount"
				value={totalAvailableAmount}
				onChangeNumber={(n) => updateValue({ totalAvailableAmount: n })}
				type="decimal"
				required
				decimalScale={18}
				error={errors.totalAvailableAmount}
			/>
			<div>
				<Label title="Enter fiat order limit" />
				<div className="flex flex-row gap-x-8 -mt-6">
					<Input
						placeholder="100"
						label="Min:"
						addOn={<span className="text-gray-500 sm:text-sm">{currency!.name}</span>}
						id="limitMin"
						type="decimal"
						value={limitMin}
						onChangeNumber={(n) => updateValue({ limitMin: n })}
						error={errors.limitMin}
					/>
					<Input
						placeholder="1000"
						label="Max:"
						addOn={<span className="text-gray-500 sm:text-sm">{currency!.name}</span>}
						id="limitMax"
						type="decimal"
						value={limitMax}
						onChangeNumber={(n) => updateValue({ limitMax: n })}
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
				error={errors.margin}
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
