import React, { useState } from 'react';

import { useTimezoneSelect, allTimezones } from 'react-timezone-select';
import Select from './Select';
import { TimezoneSelectProps } from './Select.types';

const TimezoneSelect = ({ onSelect, selected, error }: TimezoneSelectProps) => {
	const [search, setSearch] = useState('');
	const { options } = useTimezoneSelect({ labelStyle: 'original', timezones: allTimezones });

	let results = options;
	if (search) {
		results = options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()));
	}

	const handleSelect = (option: any) => {
		onSelect(option);
		setSearch('');
	};

	return (
		<Select
			label="Select your Time Zone"
			options={results.map((option, index) => ({
				id: index,
				name: option.label,
				value: option.value
			}))}
			selected={selected}
			onSelect={handleSelect}
			onSearch={setSearch}
			error={error}
		/>
	);
};
export default TimezoneSelect;
