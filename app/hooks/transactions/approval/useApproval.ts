import { BigNumber } from 'ethers';
import { Token } from 'models/types';
import { useAccount, useNetwork } from 'wagmi';

import useGaslessApproval from './useGaslessApproval';
import useTokenApproval from './useTokenApproval';

interface UseTokenApprovalProps {
	token: Token;
	spender: `0x${string}`;
	amount: BigNumber;
}

const useApproval = ({ token, spender, amount }: UseTokenApprovalProps) => {
	const { gasless } = token;
	const { address } = useAccount();
	const { chain, chains } = useNetwork();

	const withGasCall = useTokenApproval({
		address: token.address,
		spender,
		amount
	});

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, approve } = useGaslessApproval({
		amount,
		chain: chain || chains[0],
		spender,
		tokenAddress: token.address,
		userAddress: address!
	});

	if (gasless && !isFetching && gaslessEnabled) {
		return { isLoading, isSuccess, data, approve };
	}

	return withGasCall;
};
export default useApproval;
