// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { minkeApi } from './utils/utils';

const fetchMerchants = async (): Promise<`0x${string}`[]> => {
	const { data } = await minkeApi.get('/merchants');
	return data;
};

export default async function handler(_: NextApiRequest, res: NextApiResponse<`0x${string}`[]>) {
	try {
		const result = await fetchMerchants();
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json([]);
	}
}
