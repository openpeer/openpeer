// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Order } from 'models/types';
import { getSession } from 'next-auth/react';

import type { NextApiRequest, NextApiResponse } from 'next';
import { minkeApi } from '../../utils/utils';

const cancelOrder = async (id: string, body: NextApiRequest['body'], token: string): Promise<Order> => {
	const { data } = await minkeApi.patch(`/orders/${id}/cancel`, body, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Order>) {
	const { id, body } = req.query;
	// @ts-ignore
	const { jwt } = await getSession({ req });

	try {
		const result = await cancelOrder(id as string, body, jwt);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json({} as Order);
	}
}
