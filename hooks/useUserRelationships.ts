// hooks/useUserRelationships.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from 'models/types';

interface UserRelationships {
	blocked_users: User[];
	blocked_by_users: User[];
	trusted_users: User[];
	trusted_by_users: User[];
}

const useUserRelationships = (address: string | undefined) => {
	const [userRelationships, setUserRelationships] = useState<UserRelationships | null>(null);

	useEffect(() => {
		if (address) {
			axios
				.get('/api/user_relationships', {
					headers: {
						'X-User-Address': address
					}
				})
				.then((response) => {
					setUserRelationships(response.data);
				})
				.catch((error) => {
					console.error('Error fetching user relationships:', error);
				});
		}
	}, [address]);

	return userRelationships;
};

export default useUserRelationships;
