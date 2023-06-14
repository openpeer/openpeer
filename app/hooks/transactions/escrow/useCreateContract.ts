import { OpenPeerEscrow } from 'abis';
import { BigNumber, constants } from 'ethers';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import { UseEscrowFundsProps } from '../types';

const useCreateContract = ({ orderID, buyer, amount, token, fee, contract }: UseEscrowFundsProps) => {
	const { address } = token;
	const nativeToken = address === constants.AddressZero;

	const { config } = usePrepareContractWrite({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: nativeToken ? 'createNativeEscrow' : 'createERC20Escrow',
		args: nativeToken ? [orderID, buyer, amount] : [orderID, buyer, address, amount],
		overrides: {
			gasLimit: BigNumber.from('2000000'),
			value: nativeToken ? amount.add(fee) : undefined
		}
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, escrowFunds: write, data, isFetching: false };
};

export default useCreateContract;
