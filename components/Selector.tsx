import React from 'react';
import { NumericFormat, OnValueChange } from 'react-number-format';

import Button from './Button/Button';

interface SelectorProps {
	value: number;
	suffix: string;
	underValue?: string;
	updateValue: (n: number) => void;
	error?: string;
	allowNegative?: boolean;
	changeableAmount?: number;
	decimals?: number;
	minValue?: number;
	maxValue?: number;
}

const Selector = ({
	value,
	suffix,
	underValue,
	updateValue,
	error,
	allowNegative = false,
	changeableAmount = 0.01,
	decimals = 2,
	minValue,
	maxValue
}: SelectorProps) => {
	const changeAmount = (newAmount: number) => {
		if (maxValue !== undefined && newAmount >= maxValue) {
			updateValue(maxValue);
			return;
		}

		if ((!allowNegative && newAmount < 0) || (minValue !== undefined && newAmount <= minValue)) {
			updateValue(minValue || 0);
			return;
		}

		updateValue(newAmount);
	};

	const onValueChange: OnValueChange = ({ floatValue }) => {
		const valueChanged = floatValue || 0;
		changeAmount(valueChanged);
	};

	return (
		<div className="flex flex-row justify-between items-center bg-gray-100 my-8 py-4 p-8 border-2 border-slate-200 rounded-md">
			{allowNegative || value > 0 ? (
				<Button title="-" minimal onClick={() => changeAmount(value - changeableAmount)} />
			) : (
				<div />
			)}
			<div className="flex flex-col">
				<div className="flex flex-row justify-center items-center text-xl font-bold mb-2">
					<NumericFormat
						value={value}
						onValueChange={onValueChange}
						className="bg-white w-1/3 text-center rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-slate-400 mr-2"
						allowedDecimalSeparators={[',', '.']}
						decimalScale={decimals}
						inputMode="decimal"
						allowNegative={allowNegative}
					/>
					{suffix}
				</div>
				{!!error && <p className="text-center mt-2 text-sm text-red-600">{error}</p>}
				<div className="text-sm text-center">{underValue}</div>
			</div>
			<Button title="+" minimal onClick={() => changeAmount(value + changeableAmount)} />
		</div>
	);
};

export default Selector;
