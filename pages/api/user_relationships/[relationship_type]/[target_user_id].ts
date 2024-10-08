import { NextApiRequest, NextApiResponse } from 'next';
import { minkeApi } from '../../utils/utils';
import axios from 'axios';
import { getUserRelationshipsFromApi } from '../index';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { method, query, headers } = req;
	const { relationship_type, target_user_id } = query;
	const userAddress = headers['x-user-address'] as string;

	if (!userAddress) {
		return res.status(401).json({ error: 'Unauthorized: Missing user address' });
	}

	if (!target_user_id || Array.isArray(target_user_id)) {
		return res.status(400).json({ error: 'Invalid target_user_id' });
	}

	if (
		!relationship_type ||
		Array.isArray(relationship_type) ||
		(relationship_type !== 'trusted' && relationship_type !== 'blocked')
	) {
		return res.status(400).json({ error: 'Invalid relationship_type' });
	}

	try {
		switch (method) {
			case 'POST': {
				// Fetch current user relationships
				const { trusted_users, blocked_users } = await getUserRelationshipsFromApi(userAddress);

				// Check for conflicts
				if (
					relationship_type === 'trusted' &&
					blocked_users.some((user) => user.address.toLowerCase() === target_user_id.toLowerCase())
				) {
					return res
						.status(400)
						.json({
							error: 'User is in the blocked list. Remove them from the blocked list before adding as trusted.'
						});
				}
				if (
					relationship_type === 'blocked' &&
					trusted_users.some((user) => user.address.toLowerCase() === target_user_id.toLowerCase())
				) {
					return res
						.status(400)
						.json({
							error: 'User is in the trusted list. Remove them from the trusted list before adding as blocked.'
						});
				}

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
