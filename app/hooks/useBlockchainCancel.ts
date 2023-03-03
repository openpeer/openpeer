import { OpenPeerEscrow } from 'abis';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

interface UseBlockchainCancelParams {
	contract: `0x${string}`;
	isBuyer: boolean;
}

const useBlockchainCancel = ({ contract, isBuyer }: UseBlockchainCancelParams) => {
	const { config } = usePrepareContractWrite({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: isBuyer ? 'buyerCancel' : 'sellerCancel'
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, cancelOrder: write, data };
};

export default useBlockchainCancel;
