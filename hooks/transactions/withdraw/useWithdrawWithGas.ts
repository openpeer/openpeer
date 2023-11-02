import { OpenPeerEscrow } from 'abis';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import { HARDCODED_GAS_CHAINS } from 'models/networks';
import { UseWithdrawFundsProps } from '../types';

const useWithdrawWithGas = ({ amount, token, contract }: UseWithdrawFundsProps) => {
	const { config } = usePrepareContractWrite({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: 'withdrawBalance',
		args: [token.address, amount],
		gas: HARDCODED_GAS_CHAINS.includes(token.chain_id) ? BigInt('300000') : undefined
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, withdrawFunds: write, data, isFetching: false };
};

export default useWithdrawWithGas;
