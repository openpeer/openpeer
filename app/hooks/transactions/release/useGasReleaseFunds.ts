import { OpenPeerEscrow } from 'abis';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

interface UseGasReleaseFundsParams {
	contract: `0x${string}`;
}

const useGasReleaseFunds = ({ contract }: UseGasReleaseFundsParams) => {
	const { config } = usePrepareContractWrite({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: 'release'
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, releaseFunds: write, data };
};

export default useGasReleaseFunds;
