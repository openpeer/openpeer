// pages/api/user_relationships/[relationship_type]/[target_user_id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { minkeApi } from '../../utils/utils';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { method, query } = req;
	const address = req.headers.authorization?.split(' ')[1];
	const { relationship_type, target_user_id } = query;

	if (!address) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	try {
		switch (method) {
			case 'POST':
				const addResponse = await minkeApi.post(
					`/user_relationships/${relationship_type}/${target_user_id}`,
					null,
					{
						headers: {
							Authorization: `Bearer ${address}`
						}
					}
				);
				res.status(addResponse.status).json(addResponse.data);
				break;
			case 'DELETE':
				const deleteResponse = await minkeApi.delete(
					`/user_relationships/${relationship_type}/${target_user_id}`,
					{
						headers: {
							Authorization: `Bearer ${address}`
						}
					}
				);
				res.status(200).json(deleteResponse.data);
				break;
			default:
				res.setHeader('Allow', ['POST', 'DELETE']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			// Pass through the status code and error message from the backend
			res.status(error.response.status).json(error.response.data);
		} else {
			console.error('Error in user_relationships API:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}
}
