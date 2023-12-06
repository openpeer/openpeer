import useNetwork from 'hooks/useNetwork';
import { FULL_GASLESS_CHAINS } from 'models/networks';
import { UseEscrowTransactionProps } from '../types';
import useGaslessReleaseFunds from './useGaslessReleaseFunds';
import useGasReleaseFunds from './useGasReleaseFunds';

const useReleaseFunds = ({ contract, orderID, buyer, token, amount }: UseEscrowTransactionProps) => {
	const { chain } = useNetwork();
	const withGasCall = useGasReleaseFunds({ contract, orderID, buyer, token, amount });

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, releaseFunds } = useGaslessReleaseFunds({
		contract,
		orderID,
		buyer,
		token,
		amount
	});

	if (isFetching || !chain) {
		return { isLoading: false, isSuccess: false, isFetching };
	}

	if (gaslessEnabled && FULL_GASLESS_CHAINS.includes(chain.id)) {
		return { isLoading, isSuccess, data, releaseFunds, isFetching };
	}

	return withGasCall;
};

export default useReleaseFunds;
