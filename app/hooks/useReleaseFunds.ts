import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import OpenPeerEscrow from '../abis/OpenPeerEscrow.json';

interface UseReleaseFundsParams {
	address: `0x${string}`;
}

const useReleaseFunds = ({ address }: UseReleaseFundsParams) => {
	const { config } = usePrepareContractWrite({
		address: address,
		abi: OpenPeerEscrow,
		functionName: 'release'
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, releaseFunds: write, data };
};

export default useReleaseFunds;
