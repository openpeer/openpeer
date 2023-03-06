import { Loading } from 'components';
import { FiatCurrency } from 'models/types';
import { useEffect, useState } from 'react';

import Select from './Select';
import { SelectProps } from './Select.types';

const CurrencySelect = ({
	onSelect,
	selected,
	error,
	minimal = false
}: {
	onSelect: (option: FiatCurrency | undefined) => void;
	selected: SelectProps['selected'];
	error?: SelectProps['error'];
	minimal?: SelectProps['minimal'];
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
			onSelect={onSelect as SelectProps['onSelect']}
			error={error}
			minimal={minimal}
		/>
	) : (
		<></>
	);
};
export default CurrencySelect;
