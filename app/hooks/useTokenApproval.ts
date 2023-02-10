import { BigNumber } from 'ethers';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

interface UseTokenApprovalParams {
	address: `0x${string}`;
	spender: `0x${string}`;
	amount: BigNumber;
}

const useTokenApproval = ({ address, spender, amount }: UseTokenApprovalParams) => {
	const { config } = usePrepareContractWrite({
		address,
		abi: ['function approve(address spender, uint256 amount) external returns (bool)'],
		functionName: 'approve',
		args: [spender, amount]
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, approve: write, data };
};

export default useTokenApproval;
