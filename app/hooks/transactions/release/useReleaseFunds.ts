import useGaslessReleaseFunds from './useGaslessReleaseFunds';
import useGasReleaseFunds from './useGasReleaseFunds';

interface UseReleaseFundsProps {
	contract: `0x${string}`;
}

const useReleaseFunds = ({ contract }: UseReleaseFundsProps) => {
	const withGasCall = useGasReleaseFunds({ contract });

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, releaseFunds } = useGaslessReleaseFunds({
		contract
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
