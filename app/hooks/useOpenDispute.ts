import { OpenPeerEscrow } from 'abis';
import { BigNumber } from 'ethers';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

interface UseOpenDisputeParams {
	contract: `0x${string}`;
	disputeFee: BigNumber;
}

const useOpenDispute = ({ contract, disputeFee }: UseOpenDisputeParams) => {
	const { config } = usePrepareContractWrite({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: 'openDispute',
		overrides: {
			value: disputeFee
		}
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, openDispute: write, data };
};

export default useOpenDispute;
