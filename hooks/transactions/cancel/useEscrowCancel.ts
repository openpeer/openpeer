import { UseEscrowCancelProps } from '../types';
import useGasEscrowCancel from './useGasEscrowCancel';
import useGaslessEscrowCancel from './useGaslessEscrowCancel';

const useEscrowCancel = ({ contract, orderID, buyer, token, amount, isBuyer }: UseEscrowCancelProps) => {
	const withGasCall = useGasEscrowCancel({
		contract,
		orderID,
		buyer,
		token,
		amount,
		isBuyer
	});

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, cancelOrder } = useGaslessEscrowCancel({
		contract,
		orderID,
		buyer,
		token,
		amount,
		isBuyer
	});

	if (isFetching) {
		return { isLoading: false, isSuccess: false, isFetching };
	}

	if (gaslessEnabled) {
		return { isLoading, isSuccess, data, cancelOrder, isFetching };
	}

	return withGasCall;
};

export default useEscrowCancel;
