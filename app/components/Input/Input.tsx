import { NumericFormat, OnValueChange } from 'react-number-format';

export interface InputProps {
	label: string;
	addOn?: string;
	id: string;
	value?: number | string | undefined;
	onChange?: (value: string) => void | undefined;
	onChangeNumber?: (value: number | undefined) => void | undefined;
	type?: 'number' | 'email' | 'text' | 'decimal';
	required?: boolean;
	placeholder?: string;
	prefix?: JSX.Element;
	decimalScale?: number;
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
	onChangeNumber,
	decimalScale = 2
}: InputProps) => {
	const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(event.target.value);
	};
	// Added errors = false here to hide the error statement
	const errors = false;
	const onValueChange: OnValueChange = ({ floatValue }) => onChangeNumber?.(floatValue);
	return (
		<div className="my-8">
			<label htmlFor={id} className="block text-base font-medium text-gray-700 mb-1">
				{label}
			</label>
			<div className="relative mt-1 rounded-md shadow-sm">
				{prefix}
				{type === 'decimal' ? (
					<NumericFormat
						id={id}
						value={value}
						onValueChange={onValueChange}
						className={`block w-full rounded-md border-gray-300 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-slate-400 ${
							!!prefix && 'text-right'
						}`}
						allowedDecimalSeparators={[',', '.']}
						decimalScale={decimalScale}
						inputMode="decimal"
						placeholder={placeholder}
						required={required}
						allowNegative={false}
					/>
				) : (
					<input
						type={type}
						id={id}
						className={`block w-full rounded-md border-gray-300 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-slate-400 ${
							!!prefix && 'text-right'
						}`}
						value={value}
						onChange={onInputChange}
						placeholder={placeholder}
						required={required}
					/>
				)}
				{!!addOn && (
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
						<span className="text-gray-500 sm:text-sm">{addOn}</span>
					</div>
				)}
			</div>
			{/* error statement */}
			{errors && (
				<p className="mt-2 text-sm text-red-600" id={id}>
					This field is required and must be at least 3 characters long.
				</p>
			)}
		</div>
	);
};

export default Input;
