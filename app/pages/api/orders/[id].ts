// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Order } from 'models/types';

import { minkeApi } from '../utils/utils';

import type { NextApiRequest, NextApiResponse } from 'next';

const fetchOrder = async (id: string): Promise<Order> => {
	const { data } = await minkeApi.get(`/orders/${id}`);
	return data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Order>) {
	const { id } = req.query;

	try {
		const result = await fetchOrder(id as string);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json({} as Order);
	}
}
