// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Order } from 'models/types';
import { getSession } from 'next-auth/react';

import { minkeApi } from '../utils/utils';

// eslint-disable-next-line import/order
import type { NextApiRequest, NextApiResponse } from 'next';

const fetchOrder = async (id: string, token: string): Promise<Order> => {
	const { data } = await minkeApi.get(`/orders/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Order>) {
	const { id } = req.query;
	// @ts-ignore
	const { jwt } = await getSession({ req });

	try {
		const result = await fetchOrder(id as string, jwt);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json({} as Order);
	}
}
