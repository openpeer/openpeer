import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import Loading from 'components/Loading/Loading';
import { Bank } from 'models/types';
import React, { useEffect, useState } from 'react';

import Select from './Select';
import { SelectProps } from './Select.types';

const BankSelect = ({
	currencyId,
	onSelect,
	selected,
	error,
	labelStyle = '',
	options
}: {
	currencyId: number;
	onSelect: SelectProps['onSelect'];
	selected: SelectProps['selected'];
	error?: SelectProps['error'];
	labelStyle?: SelectProps['labelStyle'];
	options?: Bank[] | undefined;
}) => {
	const [banks, setBanks] = useState<Bank[] | undefined>(options);
	const [isLoading, setLoading] = useState(false);
	const [search, setSearch] = useState('');

	useEffect(() => {
		if (options) {
			setBanks(options);
			return;
		}

		setLoading(true);
		fetch(`/api/banks?currency_id=${currencyId}`, {
			headers: {
				Authorization: `Bearer ${getAuthToken()}`
			}
		})
			.then((res) => res.json())
			.then((data) => {
				setBanks(data);
				setLoading(false);
			});
	}, [currencyId]);

	const filteredBanks = search
		? banks?.filter(
				(b) =>
					(b.name && b.name.toLowerCase().includes(search.toLowerCase())) ||
					(b.code && b.code.toLowerCase().includes(search.toLowerCase()))
		  )
		: banks;

	if (isLoading) {
		return <Loading big={false} />;
	}

	return banks ? (
		<Select
			label="Payment Method"
			options={filteredBanks || []}
			selected={selected}
			onSelect={onSelect}
			error={error}
			labelStyle={labelStyle}
			onSearch={setSearch}
		/>
	) : (
		<></>
	);
};

export default BankSelect;
