// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Token } from '../../models/types';
import { minkeApi } from './utils/utils';

const fetchTokens = async (params: NextApiRequest['query']): Promise<Token[]> => {
	const { data } = await minkeApi.get('/tokens', { params });
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Token[]>) {
	try {
		const result = await fetchTokens(req.query);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json([]);
	}
}
