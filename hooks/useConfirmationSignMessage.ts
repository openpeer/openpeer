import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { SignMessageArgs } from '@wagmi/core';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface UseConfirmationSignMessageProps {
	onSuccess?: (data: `0x${string}`, variables: SignMessageArgs) => void;
}

const useConfirmationSignMessage = ({ onSuccess }: UseConfirmationSignMessageProps) => {
	const { primaryWallet } = useDynamicContext();
	const [data, setData] = useState<`0x${string}`>();
	const [variables, setVariables] = useState<SignMessageArgs>();

	const signMessage = async (message: string) => {
		if (!primaryWallet) return;

		const signature = (await primaryWallet.connector.signMessage(message)) as `0x${string}`;
		if (signature) {
			setData(signature);
			setVariables({ message });

			onSuccess?.(signature, { message });
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
