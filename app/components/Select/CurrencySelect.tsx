import { Loading } from 'components';
import { FiatCurrency } from 'models/types';
import { useEffect, useState } from 'react';

import Select from './Select';
import { SelectProps } from './Select.types';

const CurrencySelect = ({
	onSelect,
	selected,
	error
}: {
	onSelect: SelectProps['onSelect'];
	selected: SelectProps['selected'];
	error?: SelectProps['error'];
}) => {
	const [currencies, setCurrencies] = useState<FiatCurrency[]>();
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		fetch('/api/currencies')
			.then((res) => res.json())
			.then((data) => {
				setCurrencies(data.map((c: FiatCurrency) => ({ ...c, ...{ name: c.code } })));
				setLoading(false);
			});
	}, []);

	if (isLoading) {
		return <Loading />;
	}
	return currencies ? (
		<Select
			label="Choose Fiat currency to receive"
			options={currencies}
			selected={selected}
			onSelect={onSelect}
			error={error}
		/>
	) : (
		<></>
	);
};
export default CurrencySelect;
