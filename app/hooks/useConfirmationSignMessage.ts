import { SignMessageArgs } from '@wagmi/core';
import { verifyMessage } from 'ethers/lib/utils';
import { toast } from 'react-toastify';
import { useAccount, useSignMessage } from 'wagmi';

interface UseConfirmationSignMessageProps {
	onSuccess?: (data: `0x${string}`, variables: SignMessageArgs) => void;
}

const useConfirmationSignMessage = ({ onSuccess }: UseConfirmationSignMessageProps) => {
	const { address } = useAccount();

	const { signMessage, data, variables } = useSignMessage({
		onSuccess: async (d, v) => {
			const signingAddress = verifyMessage(v.message, d);
			if (signingAddress === address) {
				onSuccess?.(d, v);
			}
		}
	});

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
		signMessage(args);
	};

	return { signMessage: notifyAndSignMessage, data, variables };
};

export default useConfirmationSignMessage;
