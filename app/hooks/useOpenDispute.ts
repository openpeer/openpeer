import { OpenPeerEscrow } from 'abis';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import { UseOpenDisputeProps } from './transactions/types';

const useOpenDispute = ({ contract, orderID, buyer, token, amount, disputeFee }: UseOpenDisputeProps) => {
	const { config } = usePrepareContractWrite({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: 'openDispute',
		args: [orderID, buyer, token.address, amount],
		value: disputeFee
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, openDispute: write, data };
};

export default useOpenDispute;
