// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { List } from '../../models/types';
import { minkeApi } from './utils/utils';

const fetchLists = async (params: NextApiRequest['query']): Promise<List[]> => {
	const { data } = await minkeApi.get('/lists', { params });
	return data;
};

const createList = async (body: NextApiRequest['body'], token: string): Promise<List> => {
	const { data } = await minkeApi.post('/list_management', body, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<List[] | List>) {
	const { method, query, body } = req;
	// @ts-ignore
	const { jwt } = (await getSession({ req })) || {};

	try {
		switch (method) {
			case 'GET':
				res.status(200).json(await fetchLists(query));
				break;
			case 'POST':
				res.status(200).json(await createList(body, jwt));
				break;
			default:
				res.setHeader('Allow', ['GET', 'POST']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (err) {
		res.status(500).json([]);
	}
}
