// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Order } from 'models/types';
import { siweServer } from 'utils/siweServer';

import { minkeApi } from '../../utils/utils';

// eslint-disable-next-line import/order
import type { NextApiRequest, NextApiResponse } from 'next';

const cancelOrder = async (id: string, body: NextApiRequest['body'], token: string): Promise<Order> => {
	const { data } = await minkeApi.patch(`/orders/${id}/cancel`, body, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Order>) {
	const {
		body,
		query: { id }
	} = req;
	// @ts-expect-error
	const { jwt } = await siweServer.getSession(req, res);

	try {
		const result = await cancelOrder(id as string, body, jwt);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json({} as Order);
	}
}
