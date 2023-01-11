// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { List } from '../../models/types';
import { minkeApi } from './utils/utils';

import type { NextApiRequest, NextApiResponse } from 'next';

const fetchLists = async (params: NextApiRequest['query']): Promise<List[]> => {
	const { data } = await minkeApi.get('/lists', { params });
	return data;
};

const createList = async (body: NextApiRequest['body']): Promise<List> => {
	const { data } = await minkeApi.post('/lists', body);
	return data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<List[] | List>) {
	const { method, query, body } = req;

	try {
		switch (method) {
			case 'GET':
				const result = await fetchLists(query);
				res.status(200).json(result);
				break;
			case 'POST':
				res.status(200).json(await createList(body));
				break;
			default:
				res.setHeader('Allow', ['GET', 'POST']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (err) {
		res.status(500).json([]);
	}
}
