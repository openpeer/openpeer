// providers/TalkProvider.tsx

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Talk from 'talkjs';
import { Session } from '@talkjs/react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useAccount } from 'wagmi';
import axios from 'axios';
import { bootIntercom } from 'utils/intercom';

const TALKJS_APP_ID = process.env.NEXT_PUBLIC_TALKJS_APP_ID!;

interface UserDetails {
	id?: string;
	name?: string;
	email?: string;
	image_url?: string;
}

interface TalkProviderProps {
	children: React.ReactNode;
}

const TalkProvider = ({ children }: TalkProviderProps) => {
	const { address: account } = useAccount();
	const { isAuthenticated } = useDynamicContext();
	const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserDetails = async () => {
			if (!account || !isAuthenticated) return;

			try {
				// Fetch user details from your API
				const response = await axios.get(`/api/users/${account}`);
				setUserDetails(response.data);

				// Fetch the TalkJS token
				const tokenResponse = await axios.post('/api/generate_talkjs_token', { user_id: response.data.id });
				setToken(tokenResponse.data.token);

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
		const id = userDetails?.id || account!;
		const name = userDetails?.name || account!;
		const email = userDetails?.email || null;
		const photoUrl = userDetails?.image_url || undefined;

		return new Talk.User({
			id,
			name,
			email,
			photoUrl,
			role: 'user'
		});
	}, [userDetails, account]);

	// Move the check here to avoid conditional hooks
	if (!isAuthenticated || !account || !userDetails) {
		return null; // or a loading indicator
	}

	return (
		<Session appId={TALKJS_APP_ID} syncUser={syncUser}>
			{children}
		</Session>
	);
};

export default TalkProvider;
