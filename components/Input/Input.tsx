// components/Input/Input.tsx
import React from 'react';
import { NumericFormat, OnValueChange } from 'react-number-format';
import Tooltip from 'components/Tooltip';

export interface InputProps {
	label?: string;
	addOn?: JSX.Element | string;
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
	containerExtraStyle?: string;
	labelStyle?: string;
	tooltipContent?: string;
	helperText?: string;
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
	extraStyle = '',
	containerExtraStyle = '',
	labelStyle = '',
	tooltipContent,
	helperText
}: InputProps) => {
	const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(event.target.value);
	};

	const onValueChange: OnValueChange = ({ floatValue }) => onChangeNumber?.(floatValue);
	return (
		<div className={`my-8 ${containerExtraStyle}`}>
			{label && (
				<div className="flex justify-between items-center">
					<div className="flex flex-row items-center space-x-1">
						<label htmlFor={id} className={`block text-base font-medium text-gray-700 mb-1 ${labelStyle}`}>
							{label}
						</label>
						<span className="mb-1">{!!tooltipContent && <Tooltip content={tooltipContent} />}</span>
					</div>

					<span className="text-sm text-gray-500">{labelSideInfo}</span>
				</div>
			)}
			<div className="relative rounded-md shadow-sm">
				{prefix}
				{type === 'decimal' ? (
					<NumericFormat
						id={id}
						value={value}
						onValueChange={onValueChange}
						className={`block w-full rounded-md border-gray-300 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-slate-400 ${extraStyle} ${
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
						className={`block w-full rounded-md border-gray-300 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-slate-400 ${extraStyle} ${
							!!prefix && 'text-right'
						}`}
						value={value}
						onChange={onInputChange}
						placeholder={placeholder}
						required={required}
						disabled={disabled}
					/>
				)}
				{!!addOn && <div className="absolute inset-y-0 right-2 flex items-center">{addOn}</div>}
			</div>
			{!!error && <p className="mt-2 text-sm text-red-600">{error}</p>}
			{!!helperText && !error && <p className="mt-2 text-sm text-gray-600">{helperText}</p>}
		</div>
	);
};

export default Input;
