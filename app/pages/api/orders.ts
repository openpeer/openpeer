import { Order } from 'models/types';

import { minkeApi } from './utils/utils';

import type { NextApiRequest, NextApiResponse } from 'next';

const createOrder = async (body: NextApiRequest['body']): Promise<Order> => {
	const { data } = await minkeApi.post('/orders', body);
	return data;
};

const fetchOrders = async (params: NextApiRequest['query']): Promise<Order[]> => {
	const { data } = await minkeApi.get('/orders', { params });
	return data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Order | Order[]>) {
	const { method, body, query } = req;

	try {
		switch (method) {
			case 'GET':
				res.status(200).json(await fetchOrders(query));
				break;
			case 'POST':
				res.status(200).json(await createOrder(body));
				break;
			default:
				res.setHeader('Allow', ['GET', 'POST']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (err) {
		res.status(500).json({} as Order);
	}
}
