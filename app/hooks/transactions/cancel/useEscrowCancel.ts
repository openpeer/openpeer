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

	if (!isFetching && gaslessEnabled) {
		return { isLoading, isSuccess, data, cancelOrder };
	}

	return withGasCall;
};

export default useEscrowCancel;
