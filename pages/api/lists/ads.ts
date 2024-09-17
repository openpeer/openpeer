// pages/api/lists/ads.ts
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { List } from 'models/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { minkeApi } from '../utils/utils';

const fetchLists = async (token: string): Promise<List[]> => {
	const { data } = await minkeApi.get('/list_management', {
		headers: {
			Authorization: token
		}
	});
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<List[] | List>) {
	const { method, headers } = req;

	try {
		switch (method) {
			case 'GET':
				res.status(200).json(await fetchLists(headers.authorization!));
				break;
			default:
				res.setHeader('Allow', ['GET']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (err) {
		res.status(500).json([]);
	}
}
