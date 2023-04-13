import { Loading } from 'components';
import { FiatCurrency } from 'models/types';
import { useEffect, useState } from 'react';

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
	selectTheFirst = false
}: FiatCurrencySelect) => {
	const [currencies, setCurrencies] = useState<FiatCurrency[]>();
	const [isLoading, setLoading] = useState(false);

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
