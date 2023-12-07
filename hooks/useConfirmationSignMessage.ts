import { useDynamicContext } from '@dynamic-labs/sdk-react';
import { SignMessageArgs } from '@wagmi/core';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import useAccount from './useAccount';

interface UseConfirmationSignMessageProps {
	onSuccess?: (data: `0x${string}`, variables: SignMessageArgs) => void;
}

const useConfirmationSignMessage = ({ onSuccess }: UseConfirmationSignMessageProps) => {
	const { evm, isConnected } = useAccount();
	const { primaryWallet } = useDynamicContext();
	const { signMessage: tronSignMessage } = useWallet();
	const [data, setData] = useState<`0x${string}`>();
	const [variables, setVariables] = useState<SignMessageArgs>();

	const signMessage = async (message: string) => {
		if (evm && !primaryWallet) return;
		if (!evm && !isConnected) return;

		const signature =
			evm && primaryWallet ? await primaryWallet.connector.signMessage(message) : await tronSignMessage(message);
		if (signature) {
			setData(signature as `0x${string}`);
			setVariables({ message });

			onSuccess?.(signature as `0x${string}`, { message });
		}
	};

	const notifyAndSignMessage = async (args?: { message: string } | undefined) => {
		toast.info('Sign the transaction in your wallet', {
			theme: 'dark',
			position: 'top-right',
			autoClose: 5000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: false,
			progress: undefined
		});
		signMessage((args || {}).message || '');
	};

	return { signMessage: notifyAndSignMessage, data, variables };
};

export default useConfirmationSignMessage;
