import { List } from 'models/types';
import { useCallback, useEffect, useState } from 'react';

const useListPrice = (list: List) => {
	const { token, fiat_currency: currency, id, margin, margin_type: marginType } = list;
	const [price, setPrice] = useState<number | undefined>(marginType === 'fixed' ? margin : undefined);
	const { coingecko_id: uuid } = token;
	const { code } = currency;

	const updatePrice = useCallback(async () => {
		if (marginType === 'percentage') {
			fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${uuid}&vs_currencies=${code.toLowerCase()}`)
				.then((res) => res.json())
				.then((data) => {
					const apiPrice: number = data[uuid!][code.toLowerCase()];
					const percentage = margin;
					setPrice(apiPrice + (apiPrice * percentage) / 100);
				});
		} else {
			setPrice(margin);
		}
	}, [code, margin, marginType, uuid]);

	useEffect(() => {
		updatePrice();
		const timer = setInterval(updatePrice, 30 * 1000);

		return () => {
			clearTimeout(timer);
		};
	}, [id, margin, marginType, uuid, code, updatePrice]);

	return { price };
};

export default useListPrice;
