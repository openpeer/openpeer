import { constants } from 'ethers';

import { FULL_GASLESS_CHAINS } from 'models/networks';
import { useNetwork } from 'wagmi';
import { UseWithdrawFundsProps } from '../types';
import useWithdrawWithGas from './useWithdrawWithGas';
import useGaslessWithdrawFunds from './useGaslessWithdrawFunds';

const useWithdrawFundss = ({ amount, token, contract }: UseWithdrawFundsProps) => {
	const nativeToken = token.address === constants.AddressZero;
	const { chain } = useNetwork();

	const withGasCall = useWithdrawWithGas({
		contract,
		amount,
		token
	});

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, withdrawFunds } = useGaslessWithdrawFunds({
		amount,
		contract,
		token
	});

	if (isFetching || !chain) {
		return { isLoading: false, isSuccess: false, isFetching };
	}

	if (!nativeToken && gaslessEnabled && FULL_GASLESS_CHAINS.includes(chain.id)) {
		return { isLoading, isSuccess, data, withdrawFunds };
	}

	return withGasCall;
};

export default useWithdrawFundss;
