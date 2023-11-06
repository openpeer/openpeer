// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Bank } from '../../models/types';
import { minkeApi } from './utils/utils';

const fetchPaymentMethods = async (params: NextApiRequest['query'], token: string): Promise<Bank[]> => {
	const { data } = await minkeApi.get('/payment_methods', {
		params,
		headers: {
			Authorization: token
		}
	});
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Bank[]>) {
	const { query, headers } = req;
	try {
		const result = await fetchPaymentMethods(query, headers.authorization!);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json([]);
	}
}
