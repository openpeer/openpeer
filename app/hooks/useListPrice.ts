import { FiatCurrency, List, Token } from 'models/types';
import { useCallback, useEffect, useState } from 'react';

const useListPrice = (list: List | undefined) => {
	const {
		token = {} as Token,
		fiat_currency: currency = {} as FiatCurrency,
		id,
		margin,
		margin_type: marginType
	} = list || {};
	const [price, setPrice] = useState<number | undefined>(marginType === 'fixed' ? margin : undefined);
	const { coingecko_id: uuid } = token;
	const { code } = currency;

	const updatePrice = useCallback(async () => {
		if (!list) return;

		if (marginType === 'percentage') {
			fetch(`/api/prices?token=${uuid}&fiat=${code.toLowerCase()}`)
				.then((res) => res.json())
				.then((data) => {
					const apiPrice: number = data[uuid!][code.toLowerCase()];
					const percentage = margin;
					setPrice(apiPrice + (apiPrice * percentage!) / 100);
				});
		} else {
			setPrice(margin);
		}
	}, [list, code, margin, marginType, uuid]);

	useEffect(() => {
		updatePrice();
		const timer = setInterval(updatePrice, 60 * 1000);

		return () => {
			clearTimeout(timer);
		};
	}, [id, margin, marginType, uuid, code, updatePrice]);

	return { price };
};

export default useListPrice;
