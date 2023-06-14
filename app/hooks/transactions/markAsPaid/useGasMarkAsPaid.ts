import { OpenPeerEscrow } from 'abis';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import { UseEscrowTransactionProps } from '../types';

const useGasMarkAsPaid = ({ contract, orderID, buyer, token, amount }: UseEscrowTransactionProps) => {
	const { config } = usePrepareContractWrite({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: 'markAsPaid',
		args: [orderID, buyer, token.address, amount]
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, markAsPaid: write, data, isFetching: false };
};

export default useGasMarkAsPaid;
