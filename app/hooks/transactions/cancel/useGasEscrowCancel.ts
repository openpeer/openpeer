import { OpenPeerEscrow } from 'abis';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

interface UseGasEscrowCancelProps {
	contract: `0x${string}`;
	isBuyer: boolean;
}

const useGasEscrowCancel = ({ contract, isBuyer }: UseGasEscrowCancelProps) => {
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

export default useGasEscrowCancel;
