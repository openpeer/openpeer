// hooks/useUserProfile.ts

'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import Talk from 'talkjs';
import { Session } from '@talkjs/react';
import { useDynamicContext, getAuthToken } from '@dynamic-labs/sdk-react-core';
import { useAccount } from 'wagmi';
import axios from 'axios';
import { bootIntercom } from 'utils/intercom';

const TALKJS_APP_ID = process.env.NEXT_PUBLIC_TALKJS_APP_ID!;
const DEBUG = process.env.NODE_ENV === 'development';
const WEBSOCKET_TIMEOUT = 5000;
const CONNECTION_RETRY_DELAY = 1000;

interface UserDetails {
	id: string;
	name?: string;
	email: string | null;
	image_url?: string;
	created_at?: string;
	unique_identifier?: string;
}

interface TalkProviderProps {
	children: React.ReactNode;
}

interface ProviderState {
	status: 'initializing' | 'connecting' | 'connected' | 'error';
	userDetails: UserDetails | null;
	jwtToken: string | null;
	error: Error | null;
}

const initDebugLog = (message: string, data?: any): void => {
	console.log(`🔄 [TalkJS Init] ${message}`, data ? JSON.stringify(data, null, 2) : '');
};

const normalizeEmail = (email: string | string[] | null | undefined): string | null => {
	if (!email) {
		initDebugLog('No email provided');
		return null;
	}
	if (Array.isArray(email)) {
		initDebugLog('Email is array, taking first value:', email);
		return email[0] || null;
	}
	// Check if email is masked (contains asterisks)
	if (typeof email === 'string' && email.includes('*')) {
		initDebugLog('Masked email detected, returning null');
		return null;
	}
	return email;
};

// Add validation helper
const validateUserDetails = (userData: any): boolean => {
	if (!userData?.id) return false;
	if (!userData?.email || (typeof userData.email === 'string' && userData.email.includes('*'))) return false;
	return true;
};

const TalkProvider = ({ children }: TalkProviderProps): JSX.Element => {
	const [state, setState] = useState<ProviderState>({
		status: 'initializing',
		userDetails: null,
		jwtToken: null,
		error: null
	});

	const connectionRefs = useRef({
		mountedAt: Date.now(),
		wsTimeout: null as NodeJS.Timeout | null,
		wsConnection: null as WebSocket | null,
		retryCount: 0,
		maxRetries: 3,
		lastUserHash: null as string | null,
		isInitializing: false,
		wsCheckInterval: null as NodeJS.Timeout | null
	}).current;

	const { address: account } = useAccount();
	const { isAuthenticated, primaryWallet } = useDynamicContext();

	const safeSetState = useCallback((updates: Partial<ProviderState>): void => {
		initDebugLog('Updating state:', updates);
		setState((prev) => ({
			...prev,
			...updates
		}));
	}, []);

	const cleanup = useCallback((): void => {
		initDebugLog('Cleaning up connections');
		if (connectionRefs.wsTimeout) {
			clearTimeout(connectionRefs.wsTimeout);
			connectionRefs.wsTimeout = null;
		}
		if (connectionRefs.wsConnection) {
			connectionRefs.wsConnection.close();
			connectionRefs.wsConnection = null;
		}
		if (connectionRefs.wsCheckInterval) {
			clearInterval(connectionRefs.wsCheckInterval);
			connectionRefs.wsCheckInterval = null;
		}
	}, [connectionRefs]);

	const fetchUserDetails = useCallback(async (): Promise<UserDetails | null> => {
		if (!account || !isAuthenticated) {
			initDebugLog('Cannot fetch user details - not authenticated or no account');
			return null;
		}

		try {
			const authToken = getAuthToken();
			if (!authToken) throw new Error('No auth token available');

			initDebugLog('Fetching user details for account:', account);

			const response = await axios.get(`/api/user_profiles/${account}`, {
				headers: { Authorization: `Bearer ${authToken}` }
			});

			const userData = response.data;
			initDebugLog('Received user data:', userData);

			// Validate that this is the current user's data and not masked
			if (!validateUserDetails(userData)) {
				initDebugLog('Invalid or masked user data received');
				return null;
			}

			// Create consistent hash for user data
			const userHash = JSON.stringify({
				id: userData.id,
				unique_identifier: userData.unique_identifier,
				email: userData.email
			});

			// Update the hash but always return valid user data
			if (userHash !== connectionRefs.lastUserHash) {
				connectionRefs.lastUserHash = userHash;
				initDebugLog('User data hash updated');
			} else {
				initDebugLog('User data hash unchanged');
			}

			// Always return valid user data
			return userData;
		} catch (error) {
			console.error('Error fetching user details:', error);
			throw new Error(`Failed to fetch user details: ${error}`);
		}
	}, [account, isAuthenticated, connectionRefs]);

	const fetchJwtToken = useCallback(async (userId: string): Promise<string> => {
		try {
			initDebugLog('Fetching JWT token for user:', userId);
			const response = await axios.post('/api/generate_talkjs_token', { user_id: userId });
			initDebugLog('JWT token received');
			return response.data.token;
		} catch (error) {
			console.error('Error fetching JWT token:', error);
			throw new Error(`Failed to fetch JWT token: ${error}`);
		}
	}, []);

	const establishConnection = useCallback(async (): Promise<void> => {
		if (connectionRefs.isInitializing) {
			initDebugLog('Connection already initializing');
			return;
		}

		connectionRefs.isInitializing = true;
		initDebugLog('Starting connection establishment');

		try {
			safeSetState({ status: 'connecting' });

			const userData = await fetchUserDetails();
			if (!userData) {
				throw new Error('Failed to get user details');
			}

			initDebugLog('User details fetched:', userData);

			const token = await fetchJwtToken(userData.id);
			if (!token) {
				throw new Error('Failed to get JWT token');
			}

			// Update state before attempting WebSocket connection
			safeSetState({
				userDetails: userData,
				jwtToken: token,
				status: 'connected',
				error: null
			});

			// Don't set a timeout that could interrupt the TalkJS initialization
			connectionRefs.wsTimeout = null;
		} catch (error) {
			console.error('Connection establishment failed:', error);
			cleanup();

			if (connectionRefs.retryCount < connectionRefs.maxRetries) {
				connectionRefs.retryCount++;
				initDebugLog(`Retrying connection (attempt ${connectionRefs.retryCount})`);
				setTimeout(establishConnection, CONNECTION_RETRY_DELAY);
			} else {
				safeSetState({
					status: 'error',
					error: error instanceof Error ? error : new Error('Connection failed')
				});
			}
		} finally {
			connectionRefs.isInitializing = false;
		}
	}, [state.status, fetchUserDetails, fetchJwtToken, cleanup, safeSetState, connectionRefs]);

	useEffect(() => {
		if (state.status === 'connected') {
			let reconnectAttempt = 0;
			const maxReconnectAttempts = 3;
			let reconnectTimeout: NodeJS.Timeout | null = null;

			const checkConnection = () => {
				const talkSession = document.querySelector('iframe[title*="TalkJS"]');

				if (!talkSession) {
					initDebugLog('TalkJS iframe not found, handling reconnection');

					// Clear any existing timeouts
					if (reconnectTimeout) {
						clearTimeout(reconnectTimeout);
					}

					if (reconnectAttempt < maxReconnectAttempts) {
						reconnectAttempt++;
						initDebugLog(`Attempting gentle reconnect (${reconnectAttempt}/${maxReconnectAttempts})`);

						// Instead of resetting to initializing, try to re-establish just the WebSocket
						reconnectTimeout = setTimeout(async () => {
							try {
								const token = await fetchJwtToken(state.userDetails!.id);
								if (token) {
									safeSetState({
										jwtToken: token,
										status: 'connected' // Keep the connected status
									});
								}
							} catch (error) {
								console.error('Reconnection failed:', error);
								if (reconnectAttempt === maxReconnectAttempts) {
									cleanup();
									safeSetState({
										status: 'error',
										error: new Error('Failed to re-establish connection')
									});
								}
							}
						}, CONNECTION_RETRY_DELAY * reconnectAttempt);
					} else {
						// Only reset to initializing if all reconnect attempts fail
						cleanup();
						safeSetState({ status: 'error' });
					}
				} else {
					// Reset reconnect counter if connection is good
					reconnectAttempt = 0;
				}
			};

			const checkInterval = setInterval(checkConnection, 5000);

			return () => {
				if (reconnectTimeout) {
					clearTimeout(reconnectTimeout);
				}
				clearInterval(checkInterval);
			};
		}
	}, [state.status, state.userDetails, cleanup, safeSetState, fetchJwtToken]);

	useEffect(() => {
		const shouldConnect = isAuthenticated && account && primaryWallet?.connected && state.status === 'initializing';

		initDebugLog('Checking connection conditions:', {
			isAuthenticated,
			account,
			walletConnected: primaryWallet?.connected,
			status: state.status,
			shouldConnect
		});

		if (shouldConnect) {
			establishConnection();
		}

		return cleanup;
	}, [isAuthenticated, account, primaryWallet?.connected, state.status, establishConnection, cleanup]);

	const syncUser = useCallback((): Talk.User => {
		if (
			!state.userDetails?.id ||
			!state.userDetails?.email ||
			(typeof state.userDetails.email === 'string' && state.userDetails.email.includes('*'))
		) {
			throw new Error('Valid user details required for sync');
		}

		const normalizedEmail = normalizeEmail(state.userDetails.email);
		if (!normalizedEmail) {
			throw new Error('Valid email required for TalkJS sync');
		}

		initDebugLog('Pre-User Creation:', {
			id: state.userDetails.id,
			email: state.userDetails.email,
			normalizedEmail,
			emailType: typeof state.userDetails.email
		});

		const user = new Talk.User({
			id: state.userDetails.id,
			name: state.userDetails.name || state.userDetails.unique_identifier || state.userDetails.id,
			email: normalizedEmail,
			photoUrl: state.userDetails.image_url,
			role: 'user'
		});

		initDebugLog('Post-User Creation:', {
			id: user.id,
			email: user.email,
			emailType: typeof user.email
		});

		return user;
	}, [state.userDetails]);

	if (!TALKJS_APP_ID) {
		initDebugLog('No TalkJS App ID provided');
		return <>{children}</>;
	}

	return React.useMemo(() => {
		if (
			state.status !== 'connected' ||
			!state.userDetails?.email ||
			(typeof state.userDetails.email === 'string' && state.userDetails.email.includes('*'))
		) {
			initDebugLog('Not rendering TalkJS session - invalid status or email');
			return <>{children}</>;
		}

		initDebugLog('Rendering TalkJS session with user:', state.userDetails);

		return (
			<Session appId={TALKJS_APP_ID} syncUser={syncUser} token={state.jwtToken!}>
				{children}
			</Session>
		);
	}, [state.status, state.userDetails, state.jwtToken, syncUser, children]);
};

export default React.memo(TalkProvider);
