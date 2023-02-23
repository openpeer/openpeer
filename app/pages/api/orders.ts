import { Order } from 'models/types';
import { getSession } from 'next-auth/react';

import { minkeApi } from './utils/utils';

import type { NextApiRequest, NextApiResponse } from 'next';

const createOrder = async (body: NextApiRequest['body'], token: string): Promise<Order> => {
	const { data } = await minkeApi.post('/orders', body, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return data;
};

const fetchOrders = async (params: NextApiRequest['query'], token: string): Promise<Order[]> => {
	const { data } = await minkeApi.get('/orders', {
		params,
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Order | Order[]>) {
	const { method, body, query } = req;
	// @ts-ignore
	const { jwt } = await getSession({ req });

	try {
		switch (method) {
			case 'GET':
				res.status(200).json(await fetchOrders(query, jwt));
				break;
			case 'POST':
				res.status(200).json(await createOrder(body, jwt));
				break;
			default:
				res.setHeader('Allow', ['GET', 'POST']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (err) {
		res.status(500).json({} as Order);
	}
}
