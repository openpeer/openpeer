import { OpenPeerEscrow } from 'abis';
import { constants } from 'ethers';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import { UseDepositFundsProps } from '../types';

const useDepositWithGas = ({ amount, token, contract }: UseDepositFundsProps) => {
	const { address } = token;
	const nativeToken = address === constants.AddressZero;

	const { config } = usePrepareContractWrite({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: 'deposit',
		args: [token.address, amount],
		value: nativeToken ? amount : undefined,
		gas: BigInt('400000')
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, depositFunds: write, data, isFetching: false };
};

export default useDepositWithGas;
