import React from 'react';

interface TextareaProps {
	label?: string;
	rows: number;
	id: string;
	placeholder?: string;
	value: string | undefined;
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	error?: string;
}

const Textarea = ({ label, rows, id, placeholder, value, onChange, error }: TextareaProps) => (
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
		{!!error && <p className="mt-2 text-sm text-red-600">{error}</p>}
	</div>
);

export default Textarea;
