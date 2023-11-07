import React, { useState } from 'react';

import { useTimezoneSelect, allTimezones } from 'react-timezone-select';
import Select from './Select';
import { TimezoneSelectProps } from './Select.types';

const TimezoneSelect = ({ onSelect, selected }: TimezoneSelectProps) => {
	const [search, setSearch] = useState('');
	const { options, parseTimezone } = useTimezoneSelect({ labelStyle: 'original', timezones: allTimezones });

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
				value: parseTimezone(option.value)
			}))}
			selected={selected}
			onSelect={handleSelect}
			onSearch={setSearch}
		/>
	);
};
export default TimezoneSelect;