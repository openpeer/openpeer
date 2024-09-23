// pages/api/user_relationships/[relationship_type]/[target_user_id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { minkeApi } from '../../utils/utils';
import axios from 'axios';

const getTokenFromHeader = (headers: NextApiRequest['headers']): string | null => {
	const authHeader = headers.authorization;
	if (authHeader && authHeader.startsWith('Bearer ')) {
		return authHeader.substring(7);
	}
	return null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { method, query, headers } = req;
	const token = getTokenFromHeader(headers);
	const { relationship_type, target_user_id } = query;

	if (!token) {
		return res.status(401).json({ error: 'Unauthorized: Missing token' });
	}

	try {
		switch (method) {
			case 'POST': {
				const addResponse = await minkeApi.post(
					`/user_relationships/${relationship_type}/${target_user_id}`,
					null,
					{
						headers: {
							Authorization: `Bearer ${token}`
						}
					}
				);
				res.status(addResponse.status).json(addResponse.data);
				break;
			}
			case 'DELETE': {
				const deleteResponse = await minkeApi.delete(
					`/user_relationships/${relationship_type}/${target_user_id}`,
					{
						headers: {
							Authorization: `Bearer ${process.env.OPENPEER_API_KEY}`,
							'X-User-Address': headers['x-user-address']
						}
					}
				);
				res.status(deleteResponse.status).json(deleteResponse.data);
				break;
			}
			default:
				res.setHeader('Allow', ['POST', 'DELETE']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			res.status(error.response.status).json(error.response.data);
		} else {
			console.error('Error in user_relationships API:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}
}
