import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useTronAuthenticationContext } from 'contexts/TronAuthenticationContext';
import { useState } from 'react';

const useSignInWithTron = () => {
	const { connected, signMessage } = useWallet();

	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const { authenticate } = useTronAuthenticationContext();

	const authenticateUser = async () => {
		if (!connected) return;

		setIsAuthenticating(true);
		try {
			const message = 'This is a message to be signed for Tron';
			const signature = await signMessage(message);
			await authenticate(message, signature);
			setIsAuthenticating(false);
		} catch (_) {
			setIsAuthenticating(false);
		}
	};

	return { authenticateUser, isAuthenticating };
};

export default useSignInWithTron;
