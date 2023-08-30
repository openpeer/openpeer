// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Order } from 'models/types';

import jwt from 'jsonwebtoken';
import { minkeApi } from '../../utils/utils';

// eslint-disable-next-line import/order
import type { NextApiRequest, NextApiResponse } from 'next';

const cancelOrder = async (id: string, body: NextApiRequest['body'], token: string): Promise<Order> => {
	const { data } = await minkeApi.patch(`/orders/${id}/cancel`, body, {
		headers: {
			Authorization: token
		}
	});
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Order>) {
	const {
		body,
		query: { id },
		headers
	} = req;

	try {
		const result = await cancelOrder(id as string, body, headers.authorization!);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json({} as Order);
	}
}
