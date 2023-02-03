import { NumericFormat } from 'react-number-format';

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
	LabelSideInfo?: string;
	error?: string;
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
	LabelSideInfo,
	error,
	onChangeNumber
}: InputProps) => {
	const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange) onChange(event.target.value);
	};

	return (
		<div className="my-8">
			<div className="flex justify-between items-center">
				<label htmlFor={id} className="block text-base font-medium text-gray-700 mb-1">
					{label}
				</label>
				<span className="text-sm text-gray-500" id={id}>
					{LabelSideInfo}
				</span>
			</div>
			<div className="relative mt-1 rounded-md shadow-sm">
				{prefix}
				{type === 'decimal' ? (
					<NumericFormat
						id={id}
						value={value}
						onValueChange={({ floatValue }) => !!onChangeNumber && onChangeNumber(floatValue)}
						className={`block w-full rounded-md border-gray-300 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-slate-400 ${
							!!prefix && 'text-right'
						}`}
						allowedDecimalSeparators={[',', '.']}
						decimalScale={2}
						inputMode="decimal"
						placeholder={placeholder}
						required={required}
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
			{!!error && (
				<p className="mt-2 text-sm text-red-600" id={id}>
					{error}
				</p>
			)}
		</div>
	);
};

export default Input;
