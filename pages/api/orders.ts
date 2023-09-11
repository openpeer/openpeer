import { Order } from 'models/types';

import { minkeApi } from './utils/utils';

// eslint-disable-next-line import/order
import type { NextApiRequest, NextApiResponse } from 'next';

const createOrder = async (body: NextApiRequest['body'], token: string): Promise<Order> => {
	const { data } = await minkeApi.post('/orders', body, {
		headers: {
			Authorization: token
		}
	});
	return data.data;
};

const fetchOrders = async (params: NextApiRequest['query'], token: string): Promise<Order[]> => {
	const { data } = await minkeApi.get('/orders', {
		params,
		headers: {
			Authorization: token
		}
	});
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Order | Order[]>) {
	const { method, body, query, headers } = req;

	try {
		switch (method) {
			case 'GET':
				res.status(200).json(await fetchOrders(query, headers.authorization!));
				break;
			case 'POST':
				res.status(200).json(await createOrder(body, headers.authorization!));
				break;
			default:
				res.setHeader('Allow', ['GET', 'POST']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (err) {
		res.status(500).json({} as Order);
	}
}
