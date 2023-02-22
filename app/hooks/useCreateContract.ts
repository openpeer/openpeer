import { BigNumber, constants } from 'ethers';
import { Token } from 'models/types';
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import OpenPeerDeployer from '../abis/OpenPeerDeployer.json';

export const DEPLOYER_CONTRACTS: { [key: number]: `0x${string}` } = {
	137: process.env.NEXT_PUBLIC_POLYGON_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`,
	80001: process.env.NEXT_PUBLIC_MUMBAI_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`
};

interface UseCreateContractParams {
	orderID: `0x${string}`;
	buyer: `0x${string}`;
	amount: BigNumber;
	fee: BigNumber;
	token: Token;
}

const useCreateContract = ({ orderID, buyer, amount, token, fee }: UseCreateContractParams) => {
	const { chain } = useNetwork();
	const { address } = token;
	const nativeToken = address === constants.AddressZero;

	const { config } = usePrepareContractWrite({
		address: DEPLOYER_CONTRACTS[chain?.id!],
		abi: OpenPeerDeployer,
		functionName: nativeToken ? 'deployNativeEscrow' : 'deployERC20Escrow',
		args: nativeToken ? [orderID, buyer, amount] : [orderID, buyer, address, amount],
		overrides: {
			gasLimit: nativeToken ? BigNumber.from('1619220') : BigNumber.from('2000000'),
			value: nativeToken ? amount.add(fee) : undefined
		}
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash
	});

	return { isLoading, isSuccess, createContract: write, data };
};

export default useCreateContract;
