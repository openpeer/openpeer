import { BigNumber } from 'ethers';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

const FEE_BPS = 30;

interface UseCreateContractParams {
	orderID: `0x${string}`;
	buyer: `0x${string}`;
	amount: BigNumber;
}

const useCreateContract = ({ orderID, buyer, amount }: UseCreateContractParams) => {
	// @TODO: read the fee from the contract
	const fee = amount.mul(BigNumber.from(FEE_BPS)).div(BigNumber.from('10000'));
	const { config } = usePrepareContractWrite({
		address: process.env.NEXT_PUBLIC_DEPLOYER_CONTRACT_ADDRESS,
		abi: [
			{
				inputs: [
					{
						internalType: 'bytes32',
						name: '_orderID',
						type: 'bytes32'
					},
					{
						internalType: 'address payable',
						name: '_buyer',
						type: 'address'
					},
					{
						internalType: 'uint256',
						name: '_amount',
						type: 'uint256'
					}
				],
				name: 'deployNativeEscrow',
				outputs: [],
				stateMutability: 'payable',
				type: 'function'
			}
		],
		functionName: 'deployNativeEscrow',
		args: [orderID, buyer, amount],
		overrides: {
			value: amount.add(fee)
		}
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, createContract: write, data };
};

export default useCreateContract;
