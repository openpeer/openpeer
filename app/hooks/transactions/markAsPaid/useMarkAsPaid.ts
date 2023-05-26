import useGaslessMarkAsPaid from './useGaslessMarkAsPaid';
import useGasMarkAsPaid from './useGasMarkAsPaid';

interface UseMarkAsPaidProps {
	contract: `0x${string}`;
}

const useMarkAsPaid = ({ contract }: UseMarkAsPaidProps) => {
	const withGasCall = useGasMarkAsPaid({ contract });

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, markAsPaid } = useGaslessMarkAsPaid({
		contract
	});

	if (isFetching) {
		return { isLoading: false, isSuccess: false, isFetching };
	}

	if (gaslessEnabled) {
		return { isLoading, isSuccess, data, markAsPaid, isFetching };
	}

	return withGasCall;
};

export default useMarkAsPaid;
