// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import { minkeApi } from './utils/utils';

const fetchSettings = async (token: string): Promise<{ [key: string]: string }> => {
	const { data } = await minkeApi.get('/settings', {
		headers: {
			Authorization: token
		}
	});
	return data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ [key: string]: string }>) {
	const { headers } = req;

	try {
		res.status(200).json(await fetchSettings(headers.authorization!));
	} catch (err) {
		res.status(500).json({});
	}
}
