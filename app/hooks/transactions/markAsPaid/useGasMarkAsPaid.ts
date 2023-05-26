import { OpenPeerEscrow } from 'abis';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

interface UseEscrowContractParams {
	contract: `0x${string}`;
}

const useGasMarkAsPaid = ({ contract }: UseEscrowContractParams) => {
	const { config } = usePrepareContractWrite({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: 'markAsPaid'
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, markAsPaid: write, data, isFetching: false };
};

export default useGasMarkAsPaid;
