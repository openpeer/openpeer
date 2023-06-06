import { OpenPeerEscrow } from 'abis';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import { UseEscrowTransactionProps } from '../types';

const useGasReleaseFunds = ({ contract, orderID, buyer, token, amount }: UseEscrowTransactionProps) => {
	const { config } = usePrepareContractWrite({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: 'release',
		args: [orderID, buyer, token.address, amount]
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, releaseFunds: write, data, isFetching: false };
};

export default useGasReleaseFunds;
