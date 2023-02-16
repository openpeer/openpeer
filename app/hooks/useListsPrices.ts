import { List } from 'models/types';
import { useEffect, useState } from 'react';

interface Prices {
	[key: string]: { [key: string]: number };
}

const useListsPrices = (lists: List[]) => {
	const [prices, setPrices] = useState<Prices>();
	useEffect(() => {
		const fetchPrices = async () => {
			const percentageLists = lists.filter(({ margin_type: marginType }) => marginType === 'percentage');
			const fiats = percentageLists
				.map(({ fiat_currency: c }) => c.code.toLowerCase())
				.filter((v, i, a) => a.indexOf(v) == i);
			const tokens = percentageLists
				.map(({ token: t }) => t.coingecko_id.toLowerCase())
				.filter((v, i, a) => a.indexOf(v) == i);
			if (fiats.length > 0 && tokens.length > 0) {
				const response = await fetch(
					`https://api.coingecko.com/api/v3/simple/price?ids=${tokens.join(',')}&vs_currencies=${fiats.join(
						','
					)}`
				);

				setPrices(await response.json());
			}
		};

		fetchPrices();
	}, [lists]);

	return prices;
};

export default useListsPrices;
