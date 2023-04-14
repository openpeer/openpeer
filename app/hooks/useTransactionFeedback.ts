import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNetwork } from 'wagmi';

interface Params {
	isSuccess: boolean;
	hash: `0x${string}` | undefined;
	Link: JSX.Element;
}

const useTransactionFeedback = ({ isSuccess, hash, Link }: Params) => {
	const { chain } = useNetwork();

	useEffect(() => {
		if (!!hash && isSuccess && chain?.blockExplorers) {
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
	}, [isSuccess, hash, chain]);
};

export default useTransactionFeedback;
