import { constants } from 'ethers';

import { FULL_GASLESS_CHAINS } from 'models/networks';
import { useNetwork } from 'wagmi';
import { UseDepositFundsProps } from '../types';
import useDepositWithGas from './useDepositWithGas';
import useGaslessDepositFunds from './useGaslessDepositFunds';

const useDepositFunds = ({ amount, token, contract }: UseDepositFundsProps) => {
	const nativeToken = token.address === constants.AddressZero;
	const { chain } = useNetwork();

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

	if (isFetching || !chain) {
		return { isLoading: false, isSuccess: false, isFetching };
	}

	if (!nativeToken && gaslessEnabled && FULL_GASLESS_CHAINS.includes(chain.id)) {
		return { isLoading, isSuccess, data, depositFunds };
	}

	return withGasCall;
};

export default useDepositFunds;
