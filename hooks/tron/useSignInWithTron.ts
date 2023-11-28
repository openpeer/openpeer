import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useTronAuthenticationContext } from 'contexts/TronAuthenticationContext';
import { utils } from 'ethers';
import { useState } from 'react';

const useSignInWithTron = () => {
	const { connected, signMessage, wallet } = useWallet();

	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const { authenticate } = useTronAuthenticationContext();

	const authenticateUser = async () => {
		if (!connected) return;

		setIsAuthenticating(true);
		try {
			let rawMessage = 'message';
			const wc = wallet?.adapter.name === 'WalletConnect';
			if (wc) {
				const rawMessageLength = new Blob([rawMessage]).size;
				const message = utils.toUtf8Bytes('\x19Tron Signed Message:\n' + rawMessageLength + rawMessage);
				rawMessage = utils.keccak256(message);
			}
			const signature = await signMessage(rawMessage);
			await authenticate(rawMessage, signature, !wc);
			setIsAuthenticating(false);
		} catch (_) {
			setIsAuthenticating(false);
		}
	};

	return { authenticateUser, isAuthenticating };
};

export default useSignInWithTron;
