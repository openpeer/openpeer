// pages/api/lists/[id].ts
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { List } from 'models/types';
import { minkeApi } from '../utils/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

// Utility function to extract the token from the Authorization header
const getTokenFromHeader = (headers: NextApiRequest['headers']): string | null => {
	const authHeader = headers.authorization;
	if (authHeader && authHeader.startsWith('Bearer ')) {
		return authHeader.substring(7);
	}
	return null;
};

const fetchList = async (id: string, token?: string): Promise<List> => {
	const headers: any = {};
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}
	const { data } = await minkeApi.get(`/lists/${id}`, { headers });
	return data.data;
};

const updateList = async (id: string, body: NextApiRequest['body'], token: string): Promise<List> => {
	try {
		console.log('Updating list with body:', body);
		const { data } = await minkeApi.put(`/list_management/${id}`, body, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return data.data;
	} catch (error) {
		console.error('Error updating list:', error);
		throw error;
	}
};

const deleteList = async (id: string, token: string): Promise<List> => {
	const { data } = await minkeApi.delete(`/list_management/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<List | { error: string }>) {
	const { method, query, body, headers } = req;
	const { id } = query;

	console.log(`Incoming ${method} request for list ID: ${id}`);
	console.log('Request body:', body);
	console.log('Request headers:', headers);

	const token = getTokenFromHeader(headers);

	if (!token) {
		return res.status(401).json({ error: 'Unauthorized: Missing token' });
	}

	try {
		switch (method) {
			case 'GET': {
				const fetchedList = await fetchList(id as string, token);
				console.log('Fetched list:', fetchedList);
				res.status(200).json(fetchedList);
				break;
			}
			case 'PUT': {
				const { address, ...restBody } = body;
				const updatedList = await updateList(id as string, restBody, token);
				res.status(200).json(updatedList);
				break;
			}
			case 'DELETE': {
				const deletedList = await deleteList(id as string, token);
				console.log('Deleted list:', deletedList);
				res.status(200).json(deletedList);
				break;
			}
			default:
				res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (err) {
		console.error('Error handling request:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}
