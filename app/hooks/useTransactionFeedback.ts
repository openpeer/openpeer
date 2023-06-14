import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNetwork } from 'wagmi';

import { useAccountModal, useAddRecentTransaction } from '@rainbow-me/rainbowkit';

interface Params {
	isSuccess: boolean;
	hash: `0x${string}` | undefined;
	Link: JSX.Element;
	description: string;
}

const useTransactionFeedback = ({ isSuccess, hash, Link, description }: Params) => {
	const { chain } = useNetwork();
	const addRecentTransaction = useAddRecentTransaction();
	const { openAccountModal } = useAccountModal();

	useEffect(() => {
		if (hash) {
			addRecentTransaction({
				hash,
				description
			});
			openAccountModal?.();
			if (isSuccess && chain?.blockExplorers) {
				// @ts-expect-error
				document.querySelector('div[aria-labelledby="rk_account_modal_title"]')?.click();
				toast.success(Link, {
					theme: 'dark',
					position: 'top-right',
					autoClose: 10000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: false,
					progress: undefined
				});
			}
		}
	}, [isSuccess, hash, chain]);
};

export default useTransactionFeedback;
