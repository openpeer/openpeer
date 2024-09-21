import { parseAbi } from 'viem';
import { erc20ABI, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

interface UseTokenApprovalParams {
	address: `0x${string}`;
	spender: `0x${string}`;
	amount: bigint;
	noBooleanReturn: boolean;
}

const useTokenApproval = ({ address, spender, amount, noBooleanReturn }: UseTokenApprovalParams) => {
	const maxAllowance = amount === BigInt(0) ? BigInt(0) : BigInt(2 ** 256) - BigInt(1);
	const abi = [
		noBooleanReturn
			? 'function approve(address spender, uint256 value) public'
			: 'function approve(address spender, uint256 amount) external returns (bool)'
	];
	const { config } = usePrepareContractWrite({
		address,
		abi: parseAbi(abi),
		functionName: 'approve',
		args: [spender, maxAllowance]
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess, isFetching } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, isFetching, approve: write, data };
};

export default useTokenApproval;
