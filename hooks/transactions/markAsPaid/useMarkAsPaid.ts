import { UseEscrowTransactionProps } from '../types';
import useGaslessMarkAsPaid from './useGaslessMarkAsPaid';
import useGasMarkAsPaid from './useGasMarkAsPaid';

const useMarkAsPaid = ({ orderID, buyer, amount, token, contract }: UseEscrowTransactionProps) => {
	const withGasCall = useGasMarkAsPaid({ orderID, buyer, amount, token, contract });

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, markAsPaid } = useGaslessMarkAsPaid({
		orderID,
		buyer,
		amount,
		token,
		contract
	});

	if (isFetching) {
		return { isLoading: false, isSuccess: false, isFetching };
	}

	if (gaslessEnabled) {
		// always enabled does not matter the chain
		return { isLoading, isSuccess, data, markAsPaid, isFetching };
	}

	return withGasCall;
};

export default useMarkAsPaid;
