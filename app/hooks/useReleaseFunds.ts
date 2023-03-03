import { OpenPeerEscrow } from 'abis';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

interface UseReleaseFundsParams {
	escrow: `0x${string}`;
}

const useReleaseFunds = ({ escrow }: UseReleaseFundsParams) => {
	const { config } = usePrepareContractWrite({
		address: escrow,
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
