// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import jwt from 'jsonwebtoken';
import { siweServer } from 'utils/siweServer';

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
	const { address } = await siweServer.getSession(req, res);
	const encodedToken = jwt.sign(
		{ sub: address, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
		process.env.NEXTAUTH_SECRET!,
		{
			algorithm: 'HS256'
		}
	);

	try {
		switch (method) {
			case 'GET':
				res.status(200).json(await fetchLists(query));
				break;
			case 'POST':
				res.status(200).json(await createList(body, encodedToken));
				break;
			default:
				res.setHeader('Allow', ['GET', 'POST']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (err) {
		res.status(500).json([]);
	}
}
