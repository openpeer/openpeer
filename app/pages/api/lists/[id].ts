// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { List } from 'models/types';
import { getSession } from 'next-auth/react';

import { minkeApi } from '../utils/utils';

// eslint-disable-next-line import/order
import type { NextApiRequest, NextApiResponse } from 'next';

const fetchList = async (id: string): Promise<List> => {
	const { data } = await minkeApi.get(`/lists/${id}`);
	return data.data;
};

const updateList = async (id: string, body: NextApiRequest['body'], token: string): Promise<List> => {
	const { data } = await minkeApi.put(`/list_management/${id}`, body, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return data.data;
};

const deleteList = async (id: string, token: string): Promise<List> => {
	const { data } = await minkeApi.delete(`/list_management/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<List>) {
	const { method, query, body } = req;
	const { id } = query;
	// @ts-ignore
	const { jwt } = (await getSession({ req })) || {};

	try {
		switch (method) {
			case 'GET':
				res.status(200).json(await fetchList(id as string));
				break;
			case 'PUT':
				res.status(200).json(await updateList(id as string, body, jwt));
				break;
			case 'DELETE':
				res.status(200).json(await deleteList(id as string, jwt));
				break;
			default:
				res.setHeader('Allow', ['GET', 'POST']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (err) {
		res.status(500).json({} as List);
	}
}
