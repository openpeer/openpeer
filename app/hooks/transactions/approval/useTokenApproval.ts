import { BigNumber } from 'ethers';
import { erc20ABI, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

interface UseTokenApprovalParams {
	address: `0x${string}`;
	spender: `0x${string}`;
	amount: BigNumber;
}

const useTokenApproval = ({ address, spender, amount }: UseTokenApprovalParams) => {
	const { config } = usePrepareContractWrite({
		address,
		abi: erc20ABI,
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
