// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Token } from '../../models/types';
import { minkeApi } from './utils/utils';

const fetchLists = async (params: NextApiRequest['query']): Promise<Token[]> => {
	const { data } = await minkeApi.get('/quick_buy', { params });
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Token[]>) {
	try {
		const result = await fetchLists(req.query);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json([]);
	}
}
