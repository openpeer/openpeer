'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Talk from 'talkjs';
import { Session } from '@talkjs/react';
import { useDynamicContext, getAuthToken } from '@dynamic-labs/sdk-react-core';
import { useAccount } from 'wagmi';
import axios from 'axios';
import { bootIntercom } from 'utils/intercom';

const TALKJS_APP_ID = process.env.NEXT_PUBLIC_TALKJS_APP_ID!;

interface UserDetails {
	id?: string;
	name?: string;
	email?: string;
	image_url?: string;
	created_at?: string;
}

interface TalkProviderProps {
	children: React.ReactNode;
}

const TalkProvider = ({ children }: TalkProviderProps) => {
	const { address: account } = useAccount();
	const { isAuthenticated } = useDynamicContext();
	const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

	useEffect(() => {
		const fetchUserDetails = async () => {
			if (!account || !isAuthenticated) return;

			const authToken = getAuthToken();
			console.log('authToken:', authToken, typeof authToken);
			if (!authToken || authToken === 'undefined') {
				console.log('Auth token is not available yet or is invalid');
				return;
			}

			try {
				console.log('Fetching user details for account:', account);

				// Fetch user details from your API
				const response = await axios.get(`/api/user_profiles/${account}`, {
					headers: {
						Authorization: `Bearer ${authToken}`
					}
				});
				setUserDetails(response.data);

				// Log user details
				console.log('User details:', response.data);

				// Boot Intercom with user data
				bootIntercom({
					email: response.data.email,
					user_id: response.data.id,
					created_at: Math.floor(new Date(response.data.created_at).getTime() / 1000)
				});
			} catch (error) {
				console.error('Error fetching user details:', error);
			}
		};

		fetchUserDetails();
	}, [account, isAuthenticated]);

	const syncUser = useCallback(() => {
		// At this point, userDetails is guaranteed to be not null
		const id = userDetails!.id || account!;
		const name = userDetails!.name || account!;
		const email = userDetails!.email || null;
		const photoUrl = userDetails!.image_url || undefined;

		return new Talk.User({
			id,
			name,
			email,
			photoUrl,
			role: 'user'
		});
	}, [userDetails, account]);

	if (!TALKJS_APP_ID) {
		console.error('TALKJS_APP_ID is not defined');
		return <>{children}</>;
	}

	if (isAuthenticated && userDetails) {
		return (
			<Session appId={TALKJS_APP_ID} syncUser={syncUser}>
				{children}
			</Session>
		);
	}

	// Render children even if not authenticated
	return <>{children}</>;
};

export default TalkProvider;
