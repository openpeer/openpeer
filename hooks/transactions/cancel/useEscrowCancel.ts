import { FULL_GASLESS_CHAINS } from 'models/networks';
import { useNetwork } from 'wagmi';
import { UseEscrowCancelProps } from '../types';
import useGasEscrowCancel from './useGasEscrowCancel';
import useGaslessEscrowCancel from './useGaslessEscrowCancel';

const useEscrowCancel = ({ contract, orderID, buyer, token, amount, isBuyer }: UseEscrowCancelProps) => {
	const { chain } = useNetwork();
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

	if (isFetching || !chain) {
		return { isLoading: false, isSuccess: false, isFetching };
	}

	if (gaslessEnabled && (FULL_GASLESS_CHAINS.includes(chain.id) || isBuyer)) {
		return { isLoading, isSuccess, data, cancelOrder, isFetching };
	}

	return withGasCall;
};

export default useEscrowCancel;
