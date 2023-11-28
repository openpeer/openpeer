import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface TronAuthenticationContextValue {
	isAuthenticated: boolean;
	authenticate: (message: string, signature: string) => Promise<void>;
}

const TronAuthenticationContext = createContext<TronAuthenticationContextValue | undefined>(undefined);

export const TronAuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
	const { address, disconnecting, connected } = useWallet();
	const [token, setToken] = useState<string | null>(null);

	const checkToken = async (t: string | null) => {
		if (t && address) {
			const response = await fetch(`/api/siwt/verify/${address}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					address,
					token: t
				})
			});

			const valid = await response.json();

			if (valid) {
				setToken(t);
			} else {
				localStorage.removeItem('openpeer_authentication_token');
				setToken(null);
			}
		}
	};

	useEffect(() => {
		const savedToken = localStorage.getItem('openpeer_authentication_token');
		checkToken(savedToken);

		if (address === '' && connected) {
			localStorage.removeItem('openpeer_authentication_token');
			setToken(null);
		}
	}, [address]);

	useEffect(() => {
		if (disconnecting) {
			localStorage.removeItem('openpeer_authentication_token');
			setToken(null);
		}
	}, [disconnecting]);

	const authenticate = async (message: string, signature: string) => {
		const response = await fetch('/api/siwt', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				message,
				signature,
				address
			})
		});

		const newToken = await response.json();
		if (newToken) {
			localStorage.setItem('openpeer_authentication_token', newToken);
			setToken(newToken);
		}
	};

	const isAuthenticated = !!token;
	const contextValue = useMemo(() => ({ isAuthenticated, authenticate }), [isAuthenticated, authenticate]);

	return <TronAuthenticationContext.Provider value={contextValue}>{children}</TronAuthenticationContext.Provider>;
};

export const useTronAuthenticationContext = (): TronAuthenticationContextValue => {
	const context = useContext(TronAuthenticationContext);
	if (!context) {
		throw new Error('useTronAuthenticationContext must be used within a TronAuthenticationProvider');
	}
	return context;
};
