import { Token } from 'models/types';
import useAccount from 'hooks/useAccount';
import useNetwork from 'hooks/useNetwork';

import useGaslessApproval from './useGaslessApproval';
import useTokenApproval from './useTokenApproval';

interface UseTokenApprovalProps {
	token: Token;
	spender: `0x${string}`;
	amount: bigint;
}

const useApproval = ({ token, spender, amount }: UseTokenApprovalProps) => {
	const { gasless } = token;
	const { address } = useAccount();
	const { chain } = useNetwork();

	const withGasCall = useTokenApproval({
		address: token.address,
		spender,
		amount
	});

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, approve } = useGaslessApproval({
		amount,
		chain,
		spender,
		tokenAddress: token.address,
		userAddress: address!
	});

	if (isFetching) {
		return { isLoading: false, isSuccess: false, isFetching };
	}
	if (gasless && gaslessEnabled) {
		return { isLoading, isSuccess, data, approve, isFetching };
	}

	return withGasCall;
};
export default useApproval;
