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
	selectByLocation = false
}: FiatCurrencySelect) => {
	const [currencies, setCurrencies] = useState<FiatCurrency[]>();
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		const fetchCurrencyByLocation = async () => {
			if (selectByLocation && currencies) {
				const response = await fetch('https://ipapi.co/json/');
				const { currency } = await response.json();

				if (currency) {
					const toSelect = currencies.find((c) => c.code === currency);
					if (toSelect) {
						onSelect(toSelect);
					}
				}
				if (selectTheFirst && !selected && currencies[0]) {
					onSelect(currencies[0]);
				}
			}
		};
		fetchCurrencyByLocation();
	}, [currencies]);

	useEffect(() => {
		setLoading(true);
		fetch('/api/currencies')
			.then((res) => res.json())
			.then((data) => {
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

	if (isLoading) {
		return <Loading />;
	}

	return currencies ? (
		<Select
			label={label}
			options={currencies}
			selected={selected}
			onSelect={onSelect as SelectProps['onSelect']}
			error={error}
			minimal={minimal}
			height={height}
			flag
		/>
	) : (
		<></>
	);
};
export default CurrencySelect;
