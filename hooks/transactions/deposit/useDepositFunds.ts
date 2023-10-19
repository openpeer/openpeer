import { constants } from 'ethers';

import { UseDepositFundsProps } from '../types';
import useDepositWithGas from './useDepositWithGas';
import useGaslessDepositFunds from './useGaslessDepositFunds';

const useDepositFunds = ({ amount, token, contract }: UseDepositFundsProps) => {
	const nativeToken = token.address === constants.AddressZero;

	const withGasCall = useDepositWithGas({
		contract,
		amount,
		token
	});

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, depositFunds } = useGaslessDepositFunds({
		amount,
		contract,
		token
	});

	if (isFetching) {
		return { isLoading: false, isSuccess: false, isFetching };
	}

	if (!nativeToken && gaslessEnabled) {
		return { isLoading, isSuccess, data, depositFunds };
	}

	return withGasCall;
};

export default useDepositFunds;
