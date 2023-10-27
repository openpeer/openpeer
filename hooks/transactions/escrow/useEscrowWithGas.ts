import { OpenPeerEscrow } from 'abis';
import { constants } from 'ethers';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import { UseEscrowFundsProps } from '../types';

const useEscrowWithGas = ({
	orderID,
	buyer,
	amount,
	token,
	fee,
	contract,
	instantEscrow,
	sellerWaitingTime
}: UseEscrowFundsProps) => {
	const { address } = token;
	const nativeToken = address === constants.AddressZero;
	const partner = constants.AddressZero;
	const { config } = usePrepareContractWrite({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: nativeToken ? 'createNativeEscrow' : 'createERC20Escrow',
		args: nativeToken
			? [orderID, buyer, amount, partner, sellerWaitingTime, instantEscrow]
			: [orderID, buyer, address, amount, partner, sellerWaitingTime, instantEscrow],
		gas: instantEscrow ? BigInt('200000') : BigInt('400000'),
		value: nativeToken && !instantEscrow ? amount + fee : undefined
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, escrowFunds: write, data, isFetching: false };
};

export default useEscrowWithGas;
