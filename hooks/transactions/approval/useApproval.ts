import { Token } from 'models/types';
import { useAccount, useNetwork } from 'wagmi';

import useGaslessApproval from './useGaslessApproval';
import useTokenApproval from './useTokenApproval';
import { mainnet } from 'wagmi/chains';

interface UseTokenApprovalProps {
	token: Token;
	spender: `0x${string}`;
	amount: bigint;
}

const useApproval = ({ token, spender, amount }: UseTokenApprovalProps) => {
	const { gasless } = token;
	const { address } = useAccount();
	const { chain, chains } = useNetwork();

	const chainInUse = chain || chains[0];
	const noBooleanReturn = chainInUse.id === mainnet.id && token.symbol === 'USDT';

	const withGasCall = useTokenApproval({
		address: token.address,
		spender,
		amount,
		noBooleanReturn
	});

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, approve } = useGaslessApproval({
		amount,
		chain: chainInUse,
		spender,
		tokenAddress: token.address,
		userAddress: address!,
		noBooleanReturn
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
