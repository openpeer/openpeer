import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import OpenPeerEscrow from '../abis/OpenPeerEscrow.json';

interface UseOpenDisputeParams {
	contract: `0x${string}`;
}

const useOpenDispute = ({ contract }: UseOpenDisputeParams) => {
	const { config } = usePrepareContractWrite({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: 'openDispute'
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, openDispute: write, data };
};

export default useOpenDispute;
