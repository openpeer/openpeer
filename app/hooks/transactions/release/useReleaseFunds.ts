import { UseEscrowTransactionProps } from '../types';
import useGaslessReleaseFunds from './useGaslessReleaseFunds';
import useGasReleaseFunds from './useGasReleaseFunds';

const useReleaseFunds = ({ contract, orderID, buyer, token, amount }: UseEscrowTransactionProps) => {
	const withGasCall = useGasReleaseFunds({ contract, orderID, buyer, token, amount });

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, releaseFunds } = useGaslessReleaseFunds({
		contract,
		orderID,
		buyer,
		token,
		amount
	});

	if (isFetching) {
		return { isLoading: false, isSuccess: false, isFetching };
	}

	if (gaslessEnabled) {
		return { isLoading, isSuccess, data, releaseFunds, isFetching };
	}

	return withGasCall;
};

export default useReleaseFunds;
