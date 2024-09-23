import type { NextApiRequest, NextApiResponse } from 'next';
import { Bank } from '../../models/types';
import { minkeApi } from './utils/utils';

const fetchBanks = async (params: NextApiRequest['query']): Promise<Bank[]> => {
	const apiKey = process.env.API_KEY;
	if (!apiKey) {
		throw new Error('API key is not set in environment variables');
	}

	const { data } = await minkeApi.get('/api/v1/banks', {
		params,
		headers: {
			'X-Access-Token': apiKey
		}
	});
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Bank[] | { error: string }>) {
	const { method, query } = req;

	try {
		switch (method) {
			case 'GET': {
				const result = await fetchBanks(query);
				res.status(200).json(result);
				break;
			}
			default:
				res.setHeader('Allow', ['GET']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (err: any) {
		if (err.message === 'API key is not set in environment variables') {
			console.error('API key is missing from environment variables');
			res.status(500).json({ error: 'Internal server error: API key configuration issue' });
		} else if (err.response && err.response.status === 401) {
			res.status(401).json({ error: 'Unauthorized: Invalid or expired API key' });
		} else {
			console.error('Error fetching banks:', err);
			res.status(500).json({ error: 'Internal server error' });
		}
	}
}
