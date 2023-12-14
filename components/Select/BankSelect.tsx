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

	useEffect(() => {
		if (options) {
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

	if (isLoading) {
		return <Loading big={false} />;
	}

	return banks ? (
		<Select
			label="Payment Method"
			options={banks}
			selected={selected}
			onSelect={onSelect}
			error={error}
			labelStyle={labelStyle}
		/>
	) : (
		<></>
	);
};
export default BankSelect;
