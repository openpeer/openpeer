import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface PriceResponse {
	[key: string]: {
		[key: string]: number;
	};
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<PriceResponse>) {
	const {
		query: { token, fiat, tokenSymbol }
	} = req;
	try {
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
