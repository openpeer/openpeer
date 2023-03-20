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

	if (!isFetching && gaslessEnabled) {
		return { isLoading, isSuccess, data, markAsPaid };
	}

	return withGasCall;
};

export default useMarkAsPaid;
