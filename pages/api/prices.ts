import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { minkeApi } from './utils/utils';

interface PriceResponse {
	[key: string]: {
		[key: string]: number;
	};
}

const fetchPrices = async (token: string, fiat: string, priceSource: string, type: string): Promise<number | null> => {
	const { data } = await minkeApi.get(`/prices/${token}/${fiat}`, {
		params: { price_source: priceSource, type }
	});
	return data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<PriceResponse>) {
	const {
		query: { token, fiat, tokenSymbol, priceSource, type }
	} = req;

	try {
		if (!!priceSource && priceSource !== 'undefined' && priceSource !== 'coingecko') {
			const result = await fetchPrices(
				tokenSymbol as string,
				fiat as string,
				priceSource as string,
				(type as string) || 'SELL'
			);
			if (result) {
				res.status(200).json({ [token as string]: { [fiat as string]: Number(result) } });
			}
		}

		const { data } = await axios.get(
			`https://pro-api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=${fiat}`,
			{
				headers: {
					'x-cg-pro-api-key': process.env.COINGECKO_API_KEY
				}
			}
		);

		if (data && !data[token as string][fiat as string]) {
			const response = await axios.get(`https://api.coinbase.com/v2/prices/${tokenSymbol}-${fiat}/spot`);
			const {
				data: { amount }
			} = response.data;
			res.status(200).json({ [token as string]: { [fiat as string]: Number(amount) } });
			return;
		}

		res.status(200).json(data);
	} catch (err) {
		res.status(500).json({});
	}
}
