import { OpenPeerEscrow } from 'abis';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

interface UseEscrowContractParams {
	address: `0x${string}`;
}

const useMarkAsPaid = ({ address }: UseEscrowContractParams) => {
	const { config } = usePrepareContractWrite({
		address: address,
		abi: OpenPeerEscrow,
		functionName: 'markAsPaid'
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, markAsPaid: write, data };
};

export default useMarkAsPaid;
