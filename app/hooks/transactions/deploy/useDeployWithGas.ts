import { OpenPeerDeployer } from 'abis';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

interface UseDeployWithGasProps {
	contract: `0x${string}`;
}

const useDeployWithGas = ({ contract }: UseDeployWithGasProps) => {
	const { config } = usePrepareContractWrite({
		address: contract,
		abi: OpenPeerDeployer,
		functionName: 'deploy',
		gas: BigInt('2000000')
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, deploy: write, data, isFetching: false };
};

export default useDeployWithGas;
