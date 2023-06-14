import React from 'react';

interface LabelProps {
	title: string;
}

const Label = ({ title }: LabelProps) => (
	// eslint-disable-next-line jsx-a11y/label-has-associated-control
	<label className="block text-base font-medium text-gray-700 mb-1">{title}</label>
);

export default Label;
