// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { List } from 'models/types';

import { minkeApi } from '../utils/utils';

// eslint-disable-next-line import/order
import type { NextApiRequest, NextApiResponse } from 'next';

const fetchList = async (id: string): Promise<List> => {
	const { data } = await minkeApi.get(`/lists/${id}`);
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<List>) {
	const { id } = req.query;

	try {
		const result = await fetchList(id as string);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json({} as List);
	}
}
