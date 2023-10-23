import { Input, Label, Loading, MarginSwitcher } from 'components';
import { useFormErrors } from 'hooks';
import { Errors, Resolver } from 'models/errors';
import { List, Token } from 'models/types';
import React, { useEffect, useState } from 'react';

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
		margin: savedMargin,
		type
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
		if (percentage) {
			setPercentageMargin(m);
		} else {
			setFixedMargin(m);
		}
		updateValue({ margin: m });
	};

	const resolver: Resolver = () => {
		const total = totalAvailableAmount || 0;
		const min = limitMin || 0;
		const max = limitMax || 0;

		const error: Errors = {};

		const { minimum_amount: minimumAmount } = token as Token;

		if (!!minimumAmount && total < Number(minimumAmount)) {
			error.totalAvailableAmount = `Should be bigger or equals to ${minimumAmount} ${token!.name}`;
		}

		if (total <= 0) {
			error.totalAvailableAmount = 'Should be bigger than 0';
		}

		if (!!limitMax && min > max) {
			error.limitMin = 'Should be smaller than the max';
		}

		const fiatTotal = total * price!;

		if (!!limitMin && min > fiatTotal) {
			error.limitMin = `Should be smaller than the total available amount ${fiatTotal.toFixed(2)} ${
				currency!.name
			}`;
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
		if (!token || !currency) return;
		const coingeckoId = (token as Token).coingecko_id;
		fetch(`/api/prices?token=${coingeckoId}&fiat=${currency.name.toLowerCase()}&tokenSymbol=${token.name}`)
			.then((res) => res.json())
			.then((data) => {
				setPrice(data[coingeckoId][currency.name.toLowerCase()]);
			});
	}, [token, currency]);

	useEffect(() => {
		if (price) {
			if (fixedMargin === undefined) {
				setFixedMargin(price);
				if (!percentage) updateMargin(price);
			}
		}
	}, [fixedMargin, percentage, price]);

	if (!token || !currency) return <Loading />;

	return (
		<StepLayout onProceed={onProceed}>
			<Input
				label={
					type === 'BuyList' ? 'Enter total amount of crypto to buy' : 'Enter total available crypto amount'
				}
				addOn={<span className="text-gray-500 sm:text-sm mr-3">{token.name}</span>}
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
						addOn={<span className="text-gray-500 sm:text-sm mr-3">{currency.name}</span>}
						id="limitMin"
						type="decimal"
						value={limitMin}
						onChangeNumber={(n) => updateValue({ limitMin: n })}
						error={errors.limitMin}
					/>
					<Input
						placeholder="1000"
						label="Max:"
						addOn={<span className="text-gray-500 sm:text-sm mr-3">{currency.name}</span>}
						id="limitMax"
						type="decimal"
						value={limitMax}
						onChangeNumber={(n) => updateValue({ limitMax: n })}
					/>
				</div>
			</div>

			<Label title="Set Price Margin" />
			<div className="mb-4">
				<span className="text-sm text-gray-600">
					Set how you want to price {type === 'BuyList' ? 'the' : 'your'} crypto. At a fixed price or above or
					below the spot price.
				</span>
			</div>
			<MarginSwitcher
				selected={marginType}
				onSelect={onSelectType}
				currency={currency.name}
				token={token.name}
				margin={margin}
				updateMargin={updateMargin}
				error={errors.margin}
				price={price}
			/>

			<div className="w-full flex flex-row justify-between mb-8 hidden">
				<div>
					<div>Lowest price</div>
					<div className="text-xl font-bold">25.9 {currency.name}</div>
				</div>
				<div>
					<div>Highest price</div>
					<div className="text-xl font-bold">25.9 {currency.name}</div>
				</div>
			</div>
		</StepLayout>
	);
};

export default Amount;
