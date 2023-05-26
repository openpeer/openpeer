import useGasEscrowCancel from './useGasEscrowCancel';
import useGaslessEscrowCancel from './useGaslessEscrowCancel';

interface UseEscrowCancelProps {
	contract: `0x${string}`;
	isBuyer: boolean;
}

const useEscrowCancel = ({ contract, isBuyer }: UseEscrowCancelProps) => {
	const withGasCall = useGasEscrowCancel({
		contract,
		isBuyer
	});

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, cancelOrder } = useGaslessEscrowCancel({
		contract,
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
