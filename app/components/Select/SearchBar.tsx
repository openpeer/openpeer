import Input from 'components/Input/Input';
import React from 'react';

export interface SearchBarProps {
	label?: string;
	id: string;
	placeholder?: string;
	onSearch: (value: string) => void;
}

const SearchBar = ({ id, placeholder, onSearch, label = '' }: SearchBarProps) => (
	<Input
		extraStyle="font-regular pr-2"
		containerExtraStyle="my-0 mb-2 px-2"
		label={label}
		id={id}
		placeholder={placeholder}
		onChange={onSearch}
	/>
);
export default SearchBar;
