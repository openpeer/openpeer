// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Order } from 'models/types';
import { getSession } from 'next-auth/react';

import { minkeApi } from '../../utils/utils';

// eslint-disable-next-line import/order
import type { NextApiRequest, NextApiResponse } from 'next';

const createDispute = async (id: string, body: NextApiRequest['body'], token: string): Promise<Order> => {
	const { data } = await minkeApi.post(`/orders/${id}/disputes`, body, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Order>) {
	const { body, query } = req;
	const { id } = query;
	// @ts-ignore
	const { jwt } = await getSession({ req });

	try {
		const result = await createDispute(id as string, body, jwt);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json({} as Order);
	}
}
