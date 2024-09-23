import { NextApiRequest, NextApiResponse } from 'next';
import { minkeApi } from '../../utils/utils';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { method, query, headers } = req;
	const { relationship_type, target_user_id } = query;
	const userAddress = headers['x-user-address'] as string;

	if (!userAddress) {
		return res.status(401).json({ error: 'Unauthorized: Missing user address' });
	}

	try {
		switch (method) {
			case 'POST': {
				const addResponse = await minkeApi.post(
					`/user_relationships/${relationship_type}/${target_user_id}`,
					null,
					{
						headers: {
							'X-User-Address': userAddress
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
							'X-User-Address': userAddress
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
