// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { FiatCurrency } from '../../models/types';
import { minkeApi } from './utils/utils';

const fetchCurrencies = async (): Promise<FiatCurrency[]> => {
	const { data } = await minkeApi.get('/currencies');
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<FiatCurrency[]>) {
	try {
		const result = await fetchCurrencies();
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json([]);
	}
}
