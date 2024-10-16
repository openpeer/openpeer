// components/FriendlySelector.tsx

import React from 'react';
import Button from './Button/Button';

interface FriendlySelectorProps {
	value: number;
	updateValue: (n: number) => void;
	error?: string;
}

const timeOptions = [
	{ label: '15 mins', value: 15 },
	{ label: '30 mins', value: 30 },
	{ label: '1 hour', value: 60 },
	{ label: '3 hours', value: 180 },
	{ label: '6 hours', value: 360 },
	{ label: '12 hours', value: 720 },
	{ label: '24 hours', value: 1440 },
	{ label: '48 hours', value: 2880 },
	{ label: '72 hours', value: 4320 }
];

const FriendlySelector = ({ value, updateValue, error }: FriendlySelectorProps) => {
	const currentOptionIndex = timeOptions.findIndex((option) => option.value === value);
	const currentLabel = timeOptions[currentOptionIndex]?.label || timeOptions[2].label;

	const decreaseValue = () => {
		if (currentOptionIndex > 0) {
			updateValue(timeOptions[currentOptionIndex - 1].value);
		}
	};

	const increaseValue = () => {
		if (currentOptionIndex < timeOptions.length - 1) {
			updateValue(timeOptions[currentOptionIndex + 1].value);
		}
	};

	return (
		<div className="flex flex-row justify-between items-center bg-gray-100 my-8 py-4 p-8 border-2 border-slate-200 rounded-md">
			<Button title="-" minimal onClick={decreaseValue} disabled={currentOptionIndex === 0} />
			<div className="flex flex-col">
				<div className="flex flex-row justify-center items-center text-xl font-bold mb-2">
					<span className="w-1/3 text-center rounded-md border-gray-300 whitespace-nowrap">
						{currentLabel}
					</span>
				</div>
				{!!error && <p className="text-center mt-2 text-sm text-red-600">{error}</p>}
			</div>
			<Button
				title="+"
				minimal
				onClick={increaseValue}
				disabled={currentOptionIndex === timeOptions.length - 1}
			/>
		</div>
	);
};

export default FriendlySelector;
