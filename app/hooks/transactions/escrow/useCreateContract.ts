import { OpenPeerDeployer } from 'abis';
import { BigNumber, constants } from 'ethers';
import { Token } from 'models/types';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

interface UseCreateContractParams {
	orderID: `0x${string}`;
	contract: `0x${string}`;
	buyer: `0x${string}`;
	amount: BigNumber;
	fee: BigNumber;
	token: Token;
}

const useCreateContract = ({ orderID, buyer, amount, token, fee, contract }: UseCreateContractParams) => {
	const { address } = token;
	const nativeToken = address === constants.AddressZero;

	const { config } = usePrepareContractWrite({
		address: contract,
		abi: OpenPeerDeployer,
		functionName: nativeToken ? 'deployNativeEscrow' : 'deployERC20Escrow',
		args: nativeToken ? [orderID, buyer, amount] : [orderID, buyer, address, amount],
		overrides: {
			gasLimit: BigNumber.from('2000000'),
			value: nativeToken ? amount.add(fee) : undefined
		}
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, escrowFunds: write, data };
};

export default useCreateContract;
