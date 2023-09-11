import { useTransactionFeedbackModal } from 'contexts/TransactionFeedContext';
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

	const { addRecentTransaction } = useTransactionFeedbackModal();

	useEffect(() => {
		if (hash) {
			addRecentTransaction({
				hash,
				description
			});
			if (isSuccess && chain?.blockExplorers) {
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
