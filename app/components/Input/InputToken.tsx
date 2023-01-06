import Image from 'next/image';

interface InputProps {
	label: string;
	addOn?: string;
	id: string;
	value?: number | string | undefined;
	onChange?: (value: string) => void | undefined;
	type?: 'number' | 'email' | 'text';
	required?: boolean;
	placeholder?: string;
	currency: string;
}

const InputToken = ({
	label,
	id,
	addOn,
	value,
	onChange,
	type = 'text',
	required = false,
	placeholder,
	currency
}: InputProps) => {
	const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange) onChange(event.target.value);
	};

	return (
		<div className="my-8">
			<label htmlFor={id} className="block text-base font-medium text-gray-700 mb-1">
				{label}
			</label>
			<div className="relative mt-1 rounded-md shadow-sm">
				<div className="w-24 pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<div className="flex flex-row">
						<span className="mr-2">
							<Image
								src={''}
								alt={''}
								className="h-6 w-6 flex-shrink-0 rounded-full"
								width={24}
								height={24}
							/>
						</span>
						<span className="text-gray-500">{currency}</span>
					</div>
				</div>
				<input
					type={type}
					id={id}
					className="block w-full rounded-md border-gray-300 pl-28 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-slate-400"
					placeholder={placeholder}
					value={value}
					onChange={onInputChange}
					required={required}
				/>
				{!!addOn && (
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
						<span className="text-gray-500 sm:text-sm">{addOn}</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default InputToken;
