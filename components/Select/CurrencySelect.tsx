/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/indent */
import getAuthToken from 'utils/getAuthToken';
import Loading from 'components/Loading/Loading';
import { FiatCurrency } from 'models/types';
import React, { useEffect, useState } from 'react';

import Select from './Select';
import { FiatCurrencySelect, SelectProps } from './Select.types';

const CurrencySelect = ({
	onSelect,
	selected,
	error,
	height,
	selectedIdOnLoad,
	label = 'Choose Fiat currency to receive',
	minimal = false,
	selectTheFirst = false,
	selectByLocation = false,
	labelStyle = ''
}: FiatCurrencySelect) => {
	const [rawCurrencies, setRawCurrencies] = useState<FiatCurrency[]>();
	const [currencies, setCurrencies] = useState<FiatCurrency[]>();
	const [isLoading, setLoading] = useState(false);
	const [search, setSearch] = useState('');

	useEffect(() => {
		const fetchCurrencyByLocation = async () => {
			if (selectByLocation && currencies) {
				try {
					const response = await fetch('https://ipapi.co/currency/');
					const currency = await response.text();

					if (currency) {
						const toSelect = currencies.find((c) => c.code === currency);
						if (toSelect) {
							onSelect(toSelect);
						}
					}

					if (selectTheFirst && !selected && currencies[0]) {
						onSelect(currencies[0]);
					}
				} catch (e) {
					console.error('Currency API', e);
				}
			}
		};
		fetchCurrencyByLocation();
	}, [currencies]);

	useEffect(() => {
		setLoading(true);
		fetch('/api/currencies', {
			headers: {
				Authorization: `Bearer ${getAuthToken()}`
			}
		})
			.then((res) => res.json())
			.then((data) => {
				setRawCurrencies(data);
				const filtered: FiatCurrency[] = data.map((c: FiatCurrency) => ({ ...c, ...{ name: c.code } }));
				setCurrencies(filtered);
				if (selectedIdOnLoad) {
					if (!selected) {
						const toSelect = filtered.find(({ id }) => String(id) === selectedIdOnLoad);
						if (toSelect && !selected) {
							onSelect(toSelect);
						}
					}
				} else if (selectTheFirst && !selected && filtered[0]) {
					onSelect(filtered[0]);
				}
				setLoading(false);
			});
	}, []);

	const selectCurrency = (option: FiatCurrency | undefined) => {
		onSelect(option);
		setSearch('');
	};

	if (isLoading) {
		return <Loading message="" big={false} />;
	}
	const result =
		search && rawCurrencies
			? rawCurrencies
					.filter(
						(c) =>
							c.code.toLowerCase().includes(search.toLowerCase()) ||
							c.name.toLowerCase().includes(search.toLowerCase()) ||
							String(c.country_code).toLowerCase().includes(search.toLowerCase()) ||
							c.symbol.toLowerCase().includes(search.toLowerCase())
					)
					.map((c: FiatCurrency) => ({ ...c, ...{ name: c.code } }))
			: currencies;

	return result ? (
		<Select
			label={label}
			options={result}
			selected={selected}
			onSelect={selectCurrency as SelectProps['onSelect']}
			error={error}
			minimal={minimal}
			height={height}
			flag
			onSearch={setSearch}
			labelStyle={labelStyle}
		/>
	) : (
		<></>
	);
};
export default CurrencySelect;
