import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

interface UseEscrowContractParams {
	address: `0x${string}`;
}

const useEscrowContract = ({ address }: UseEscrowContractParams) => {
	const { config } = usePrepareContractWrite({
		address: address,
		abi: [
			{
				inputs: [],
				name: 'markAsPaid',
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
		functionName: 'markAsPaid'
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, markAsPaid: write, data };
};

export default useEscrowContract;
