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
	onBlur?: () => void | undefined;
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
	isUpdating?: boolean;
	maxLength?: number;
}

const Input = ({
	label,
	id,
	addOn,
	value,
	onChange,
	onBlur,
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
	helperText,
	isUpdating = false,
	maxLength
}: InputProps) => {
	// console.log(`Input ${id} isUpdating:`, isUpdating);
	const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(event.target.value);
	};

	const onValueChange: OnValueChange = ({ floatValue }) => onChangeNumber?.(floatValue);

	const baseClassName = `block w-full rounded-md pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-slate-400 ${
		!!prefix && 'text-right'
	}`;

	const borderClassName = isUpdating ? '' : 'border-gray-300';

	const updatingClassName = isUpdating
		? 'bg-blue-50 border-blue-300 outline outline-2 outline-blue-500 transition-all duration-300'
		: 'border-gray-300';

	const inputClassName = `${baseClassName} ${updatingClassName} ${extraStyle}`;

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
						className={inputClassName}
						allowedDecimalSeparators={[',', '.']}
						decimalScale={decimalScale}
						inputMode="decimal"
						placeholder={placeholder}
						required={required}
						allowNegative={false}
						disabled={disabled}
						maxLength={maxLength}
						onBlur={onBlur}
					/>
				) : (
					<input
						type={type}
						id={id}
						className={inputClassName}
						value={value}
						onChange={onInputChange}
						placeholder={placeholder}
						required={required}
						disabled={disabled}
						maxLength={maxLength}
						onBlur={onBlur}
					/>
				)}
				{!!addOn && <div className="absolute inset-y-0 right-2 flex items-center">{addOn}</div>}
				{isUpdating && (
					<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<svg
							className="animate-spin h-5 w-5 text-blue-500"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					</div>
				)}
			</div>
			{!!error && <p className="mt-2 text-sm text-red-600">{error}</p>}
			{!!helperText && !error && <p className="mt-2 text-sm text-gray-600">{helperText}</p>}
			{isUpdating && <p className="mt-2 text-sm text-blue-600 animate-pulse">Updating...</p>}
		</div>
	);
};

export default Input;
