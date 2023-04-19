import React from 'react';
import { NumericFormat, OnValueChange } from 'react-number-format';

export interface InputProps {
	label: string;
	addOn?: JSX.Element;
	id: string;
	value?: number | string | undefined;
	onChange?: (value: string) => void | undefined;
	onChangeNumber?: (value: number | undefined) => void | undefined;
	type?: 'number' | 'email' | 'text' | 'decimal';
	required?: boolean;
	placeholder?: string;
	prefix?: JSX.Element;
	labelSideInfo?: string;
	decimalScale?: number;
	error?: string;
	disabled?: boolean;
	extraStyle?: string;
}

const Input = ({
	label,
	id,
	addOn,
	value,
	onChange,
	type = 'text',
	required = false,
	placeholder,
	prefix,
	labelSideInfo,
	onChangeNumber,
	decimalScale = 2,
	error,
	disabled = false,
	extraStyle = ''
}: InputProps) => {
	const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(event.target.value);
	};

	const onValueChange: OnValueChange = ({ floatValue }) => onChangeNumber?.(floatValue);
	return (
		<div className="my-8">
			<div className="flex justify-between items-center">
				<label htmlFor={id} className="block text-base font-medium text-gray-700 mb-1">
					{label}
				</label>
				<span className="text-sm text-gray-500">{labelSideInfo}</span>
			</div>
			<div className="relative mt-1 rounded-md shadow-sm">
				{prefix}
				{type === 'decimal' ? (
					<NumericFormat
						id={id}
						value={value}
						onValueChange={onValueChange}
						className={`${extraStyle} block w-full rounded-md border-gray-300 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-slate-400 ${
							!!prefix && 'text-right'
						}`}
						allowedDecimalSeparators={[',', '.']}
						decimalScale={decimalScale}
						inputMode="decimal"
						placeholder={placeholder}
						required={required}
						allowNegative={false}
						disabled={disabled}
					/>
				) : (
					<input
						type={type}
						id={id}
						className={`${extraStyle} block w-full rounded-md border-gray-300 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-slate-400 ${
							!!prefix && 'text-right'
						}`}
						value={value}
						onChange={onInputChange}
						placeholder={placeholder}
						required={required}
						disabled={disabled}
					/>
				)}
				{!!addOn && <div className="absolute inset-y-0 right-0 flex items-center">{addOn}</div>}
			</div>
			{!!error && <p className="mt-2 text-sm text-red-600">{error}</p>}
		</div>
	);
};

export default Input;
