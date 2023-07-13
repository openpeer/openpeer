import jwt from 'jsonwebtoken';
import { Order } from 'models/types';
import { siweServer } from 'utils/siweServer';

import { minkeApi } from './utils/utils';

// eslint-disable-next-line import/order
import type { NextApiRequest, NextApiResponse } from 'next';

const createOrder = async (body: NextApiRequest['body'], token: string): Promise<Order> => {
	const { data } = await minkeApi.post('/orders', body, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return data.data;
};

const fetchOrders = async (params: NextApiRequest['query'], token: string): Promise<Order[]> => {
	const { data } = await minkeApi.get('/orders', {
		params,
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Order | Order[]>) {
	const { method, body, query } = req;
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
				res.status(200).json(await fetchOrders(query, encodedToken));
				break;
			case 'POST':
				res.status(200).json(await createOrder(body, encodedToken));
				break;
			default:
				res.setHeader('Allow', ['GET', 'POST']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (err) {
		res.status(500).json({} as Order);
	}
}
