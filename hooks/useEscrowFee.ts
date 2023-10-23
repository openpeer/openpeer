import { OpenPeerDeployer } from 'abis';
import { constants } from 'ethers';
import { DEPLOYER_CONTRACTS } from 'models/networks';
import { Token } from 'models/types';
import { Abi, parseUnits } from 'viem';
import { useContractReads } from 'wagmi';

interface UseEscrowFeeParams {
	chainId: number;
	address?: `0x${string}`;
	token: Token | undefined;
	tokenAmount: number | undefined;
}

const useEscrowFee = ({ address, tokenAmount, token, chainId }: UseEscrowFeeParams) => {
	const deployer = DEPLOYER_CONTRACTS[chainId];
	const contract = address || deployer;
	const partner = constants.AddressZero;

	const { data, isFetching } = useContractReads({
		contracts: [
			{
				address: contract,
				abi: OpenPeerDeployer as Abi,
				functionName: 'sellerFee',
				args: [partner]
			},
			{
				address: contract,
				abi: OpenPeerDeployer as Abi,
				functionName: 'openPeerFee'
			}
		]
	});

	if (isFetching || !token || !tokenAmount || !data) return { isFetching };

	const [feeResult, openPeerFeeResult] = data || [];
	const feeBps = feeResult.result as unknown;
	const openPeerFeeBps = openPeerFeeResult.result as unknown;

	const rawTokenAmount = parseUnits(tokenAmount.toString(), token.decimals);
	const fee = (rawTokenAmount * (feeBps as bigint)) / BigInt(10000);
	const totalAmount = rawTokenAmount + fee;

	return { isFetching, fee, partnerFeeBps: (feeBps as bigint) - (openPeerFeeBps as bigint), totalAmount };
};
export default useEscrowFee;
