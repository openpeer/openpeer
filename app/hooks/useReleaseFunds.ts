import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

interface UseReleaseFundsParams {
	address: `0x${string}`;
}

const useReleaseFunds = ({ address }: UseReleaseFundsParams) => {
	const { config } = usePrepareContractWrite({
		address: address,
		abi: [
			{
				inputs: [],
				name: 'release',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool'
					}
				],
				stateMutability: 'nonpayable',
				type: 'function'
			}
		],
		functionName: 'release'
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, releaseFunds: write, data };
};

export default useReleaseFunds;
