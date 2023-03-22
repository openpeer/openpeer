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

	if (!isFetching && gaslessEnabled) {
		return { isLoading, isSuccess, data, releaseFunds };
	}

	return withGasCall;
};

export default useReleaseFunds;
