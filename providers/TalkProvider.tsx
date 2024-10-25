// providers/TalkProvider.tsx

'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import Talk from 'talkjs';
import { Session } from '@talkjs/react';
import { useDynamicContext, getAuthToken } from '@dynamic-labs/sdk-react-core';
import { useAccount } from 'wagmi';
import axios from 'axios';
import { isEqual } from 'lodash';

const TALKJS_APP_ID = process.env.NEXT_PUBLIC_TALKJS_APP_ID!;
const CONNECTION_RETRY_DELAY = 1000;
const MAX_RECONNECT_ATTEMPTS = 3;
const INITIALIZATION_DELAY = 500;

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

interface TalkJSError {
	message: string;
	code?: string;
	details?: unknown;
}

// const initDebugLog = (message: string, data?: any): void => {
// 	console.log(`🔄 [TalkJS Init] ${message}`, data ? JSON.stringify(data, null, 2) : '');
// };

const normalizeEmail = (email: string | string[] | null | undefined): string | null => {
	if (!email) {
		// initDebugLog('No email provided');
		return null;
	}
	if (Array.isArray(email)) {
		// initDebugLog('Email is array, taking first value:', email);
		return email[0] || null;
	}
	if (typeof email === 'string' && email.includes('*')) {
		// initDebugLog('Masked email detected, returning null');
		return null;
	}
	return email;
};

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
	const [talkInitialized, setTalkInitialized] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const connectionRefs = useRef({
		mountedAt: Date.now(),
		wsTimeout: null as NodeJS.Timeout | null,
		wsConnection: null as WebSocket | null,
		retryCount: 0,
		maxRetries: MAX_RECONNECT_ATTEMPTS,
		lastUserHash: null as string | null,
		isInitializing: false,
		wsCheckInterval: null as NodeJS.Timeout | null,
		lastCheckTime: Date.now()
	}).current;

	const { address: account } = useAccount();
	const { isAuthenticated, primaryWallet } = useDynamicContext();

	const safeSetState = useCallback((updates: Partial<ProviderState>): void => {
		// initDebugLog('Updating state:', updates);
		setState((prev) => {
			const newState = {
				...prev,
				...updates
			};
			return isEqual(prev, newState) ? prev : newState;
		});
	}, []);

	const cleanup = useCallback((): void => {
		// initDebugLog('Cleaning up connections');
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
		connectionRefs.isInitializing = false;
	}, [connectionRefs]);

	const handleWebSocketError = useCallback(() => {
		if (connectionRefs.retryCount < connectionRefs.maxRetries) {
			connectionRefs.retryCount++;
			setTimeout(() => {
				cleanup();
				establishConnection();
			}, CONNECTION_RETRY_DELAY * connectionRefs.retryCount);
		} else {
			safeSetState({
				status: 'error',
				error: new Error('Failed to establish WebSocket connection')
			});
		}
	}, [connectionRefs, cleanup]);

	const fetchUserDetails = useCallback(async (): Promise<UserDetails | null> => {
		if (!account || !isAuthenticated) {
			// initDebugLog('Cannot fetch user details - not authenticated or no account');
			return null;
		}

		try {
			const authToken = getAuthToken();
			if (!authToken) throw new Error('No auth token available');

			// initDebugLog('Fetching user details for account:', account);

			const response = await axios.get(`/api/user_profiles/${account}`, {
				headers: { Authorization: `Bearer ${authToken}` }
			});

			const userData = response.data;
			// initDebugLog('Received user data:', userData);

			if (!validateUserDetails(userData)) {
				// initDebugLog('Invalid or masked user data received');
				return null;
			}

			const userHash = JSON.stringify({
				id: userData.id,
				unique_identifier: userData.unique_identifier,
				email: userData.email
			});

			if (userHash !== connectionRefs.lastUserHash) {
				connectionRefs.lastUserHash = userHash;
				// initDebugLog('User data hash updated');
			}

			return userData;
		} catch (error) {
			console.error('Error fetching user details:', error);
			throw new Error(`Failed to fetch user details: ${error}`);
		}
	}, [account, isAuthenticated, connectionRefs]);

	const fetchJwtToken = useCallback(async (userId: string): Promise<string> => {
		try {
			// initDebugLog('Fetching JWT token for user:', userId);
			const response = await axios.post('/api/generate_talkjs_token', { user_id: userId });
			// initDebugLog('JWT token received');
			return response.data.token;
		} catch (error) {
			console.error('Error fetching JWT token:', error);
			throw new Error(`Failed to fetch JWT token: ${error}`);
		}
	}, []);

	const establishConnection = useCallback(async (): Promise<void> => {
		if (!talkInitialized || connectionRefs.isInitializing) {
			// initDebugLog('Cannot establish connection - Talk not initialized or already initializing');
			return;
		}

		connectionRefs.isInitializing = true;
		// initDebugLog('Starting connection establishment');

		try {
			if (state.status !== 'connecting') {
				safeSetState({ status: 'connecting' });
			}

			const userData = await fetchUserDetails();
			if (!userData) {
				throw new Error('Failed to get user details');
			}

			const token = await fetchJwtToken(userData.id);
			if (!token) {
				throw new Error('Failed to get JWT token');
			}

			// Increased delay to ensure proper initialization
			await new Promise((resolve) => setTimeout(resolve, INITIALIZATION_DELAY));

			if (!isEqual(userData, state.userDetails) || token !== state.jwtToken) {
				safeSetState({
					userDetails: userData,
					jwtToken: token,
					status: 'connected',
					error: null
				});
			}
		} catch (error) {
			console.error('Connection establishment failed:', error);
			cleanup();

			if (connectionRefs.retryCount < connectionRefs.maxRetries) {
				connectionRefs.retryCount++;
				setTimeout(establishConnection, CONNECTION_RETRY_DELAY * connectionRefs.retryCount);
			} else {
				safeSetState({
					status: 'error',
					error: error instanceof Error ? error : new Error('Connection failed')
				});
			}
		} finally {
			connectionRefs.isInitializing = false;
		}
	}, [
		talkInitialized,
		state.status,
		state.userDetails,
		state.jwtToken,
		fetchUserDetails,
		fetchJwtToken,
		cleanup,
		safeSetState,
		connectionRefs
	]);

	useEffect(() => {
		// Initialize Talk
		if (!talkInitialized && TALKJS_APP_ID) {
			Talk.ready
				.then(() => {
					// initDebugLog('TalkJS initialized successfully');
					setTalkInitialized(true);
				})
				.catch((error) => {
					console.error('Failed to initialize TalkJS:', error);
					safeSetState({
						status: 'error',
						error: new Error('Failed to initialize TalkJS')
					});
				});
		}
	}, [talkInitialized, safeSetState]);

	useEffect(() => {
		if (state.status === 'connected') {
			let reconnectAttempt = 0;
			let lastCheckTime = Date.now();

			const checkConnection = async () => {
				const talkSession = document.querySelector('iframe[title*="TalkJS"]');
				const currentTime = Date.now();

				if (currentTime - lastCheckTime < 2000) {
					return;
				}
				lastCheckTime = currentTime;

				if (!talkSession && state.userDetails?.id) {
					// initDebugLog('TalkJS iframe not found, handling reconnection');

					if (reconnectAttempt < MAX_RECONNECT_ATTEMPTS) {
						reconnectAttempt++;

						try {
							cleanup();
							await new Promise((resolve) => setTimeout(resolve, CONNECTION_RETRY_DELAY));
							const newToken = await fetchJwtToken(state.userDetails.id);
							if (newToken && newToken !== state.jwtToken) {
								safeSetState({
									jwtToken: newToken,
									error: null
								});
							}
						} catch (error) {
							console.error('Reconnection attempt failed:', error);
							if (reconnectAttempt === MAX_RECONNECT_ATTEMPTS) {
								cleanup();
								safeSetState({ status: 'error' });
							}
						}
					} else {
						cleanup();
						safeSetState({ status: 'error' });
					}
				} else {
					reconnectAttempt = 0;
				}
			};

			const checkInterval = setInterval(checkConnection, 5000);
			return () => clearInterval(checkInterval);
		}
	}, [state.status, state.userDetails, state.jwtToken, fetchJwtToken, cleanup, safeSetState]);

	useEffect(() => {
		const shouldConnect =
			talkInitialized &&
			isAuthenticated &&
			account &&
			primaryWallet?.connected &&
			state.status === 'initializing';

		if (shouldConnect) {
			establishConnection();
		}
	}, [talkInitialized, isAuthenticated, account, primaryWallet?.connected, state.status, establishConnection]);

	useEffect(() => {
		if (state.status === 'connected') {
			const timer = setTimeout(() => setIsLoading(false), 1000);
			return () => clearTimeout(timer);
		}
	}, [state.status]);

	const syncUser = useCallback((): Talk.User => {
		const normalizedEmail = state.userDetails?.email ? normalizeEmail(state.userDetails.email) : null;

		if (!state.userDetails?.id || !normalizedEmail) {
			throw new Error('Invalid user data for sync');
		}

		try {
			const user = new Talk.User({
				id: state.userDetails.id,
				name: state.userDetails.name || state.userDetails.unique_identifier || state.userDetails.id,
				email: normalizedEmail,
				photoUrl: state.userDetails.image_url,
				role: 'user'
			});

			// initDebugLog('User sync successful:', {
			// 	id: user.id,
			// 	email: user.email
			// });

			return user;
		} catch (error) {
			console.error('Error syncing user:', error);
			safeSetState({ status: 'error', error: new Error('Failed to sync user') });
			throw new Error('Failed to sync user');
		}
	}, [state.userDetails, safeSetState]);

	useEffect(() => {
		return () => {
			cleanup();
			connectionRefs.retryCount = 0;
			connectionRefs.isInitializing = false;
		};
	}, [cleanup, connectionRefs]);

	if (!TALKJS_APP_ID) {
		// initDebugLog('No TalkJS App ID provided');
		return <>{children}</>;
	}

	return React.useMemo(() => {
		if (
			isLoading ||
			!talkInitialized ||
			state.status !== 'connected' ||
			!state.userDetails?.email ||
			(typeof state.userDetails.email === 'string' && state.userDetails.email.includes('*'))
		) {
			// initDebugLog('Not rendering TalkJS session - invalid status or email');
			return <>{children}</>;
		}

		// initDebugLog('Rendering TalkJS session with user:', state.userDetails);

		return (
			<Session appId={TALKJS_APP_ID} syncUser={syncUser} token={state.jwtToken!}>
				{children}
			</Session>
		);
	}, [isLoading, talkInitialized, state.status, state.userDetails, state.jwtToken, syncUser, children]);
};

export default React.memo(TalkProvider);
