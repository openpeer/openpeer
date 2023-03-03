interface TextareaProps {
	label?: string;
	rows: number;
	id: string;
	placeholder?: string;
	value: string | undefined;
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	errors?: string;
}

const Textarea = ({ label, rows, id, placeholder, value, onChange, errors }: TextareaProps) => {
	return (
		<div className="mb-8">
			<label htmlFor={id} className="block text-base font-medium text-gray-700">
				{label}
			</label>
			<div className="mt-1">
				<textarea
					rows={rows}
					id={id}
					placeholder={placeholder}
					className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					value={value}
					onChange={onChange}
				/>
			</div>
			{!!errors && <p className="mt-2 text-sm text-red-600">{errors}</p>}
		</div>
	);
};

export default Textarea;
