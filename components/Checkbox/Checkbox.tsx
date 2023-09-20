import React from 'react';

interface CheckboxProps {
	content: string;
	id: string;
	name: string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	checked?: boolean;
}

const Checkbox = ({ content, id, name, checked, onChange }: CheckboxProps) => (
	<div className="relative flex items-start py-2.5">
		<div className="flex h-6 items-center">
			<input
				id={id}
				name={name}
				type="checkbox"
				checked={checked}
				aria-describedby="comments-description"
				className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
				onChange={onChange}
			/>
		</div>
		<div className="ml-2 text-base">
			<label htmlFor={id} className="font-medium text-gray-700 cursor-pointer">
				{content}
			</label>
		</div>
	</div>
);

export default Checkbox;
