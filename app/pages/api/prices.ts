import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface PriceResponse {
	[key: string]: {
		[key: string]: number;
	};
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<PriceResponse>) {
	const {
		query: { token, fiat }
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
		res.status(200).json(data);
	} catch (err) {
		res.status(500).json({});
	}
}
