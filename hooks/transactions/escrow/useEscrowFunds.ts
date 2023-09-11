import { constants } from 'ethers';

import { UseEscrowFundsProps } from '../types';
import useEscrowWithGas from './useEscrowWithGas';
import useGaslessEscrow from './useGaslessEscrow';

const useEscrowFunds = ({ orderID, buyer, amount, token, fee, contract }: UseEscrowFundsProps) => {
	const nativeToken = token.address === constants.AddressZero;

	const withGasCall = useEscrowWithGas({
		orderID,
		contract,
		buyer,
		amount,
		token,
		fee
	});

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, escrowFunds } = useGaslessEscrow({
		amount,
		buyer,
		contract,
		orderID,
		token
	});

	if (isFetching) {
		return { isLoading: false, isSuccess: false, isFetching };
	}

	if (!nativeToken && gaslessEnabled) {
		return { isLoading, isSuccess, data, escrowFunds };
	}

	return withGasCall;
};

export default useEscrowFunds;
