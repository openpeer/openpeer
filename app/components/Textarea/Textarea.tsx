interface TextareaProps {
	label?: string;
	rows: number;
	id: string;
	placeholder?: string;
	value: string | undefined;
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea = ({ label, rows, id, placeholder, value, onChange }: TextareaProps) => {
	// Added errors = false here to hide the error statement
	const errors = false;

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
			{/* error statement */}
			{errors && (
				<p className="mt-2 text-sm text-red-600" id={id}>
					This field is required and must be at least 3 characters long.
				</p>
			)}
		</div>
	);
};

export default Textarea;
