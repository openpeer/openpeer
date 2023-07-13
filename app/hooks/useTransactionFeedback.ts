import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNetwork } from 'wagmi';

interface Params {
	isSuccess: boolean;
	hash: `0x${string}` | undefined;
	Link: JSX.Element;
	description: string;
}

const useTransactionFeedback = ({ isSuccess, hash, Link, description }: Params) => {
	const { chain } = useNetwork();

	// @TODO - Marcos - Add to recent transactions
	const addRecentTransaction = (a: any) => console.log(a);
	const openAccountModal = () => console.log('a');

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
