import { OpenPeerEscrow } from 'abis';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import { UseEscrowCancelProps } from '../types';

const useGasEscrowCancel = ({ contract, isBuyer, orderID, buyer, token, amount }: UseEscrowCancelProps) => {
	const { config } = usePrepareContractWrite({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: isBuyer ? 'buyerCancel' : 'sellerCancel',
		args: [orderID, buyer, token.address, amount]
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, cancelOrder: write, data, isFetching: false };
};

export default useGasEscrowCancel;
