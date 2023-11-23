import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useState } from 'react';

const useSignInWithTron = () => {
	const { connected, signMessage } = useWallet();

	const [isAuthenticating, setIsAuthenticating] = useState(false);

	const authenticateUser = async () => {
		if (!connected) return;

		setIsAuthenticating(true);
		const signature = await signMessage('message');

		setIsAuthenticating(false);
	};

	return { authenticateUser, isAuthenticating };
};

export default useSignInWithTron;
