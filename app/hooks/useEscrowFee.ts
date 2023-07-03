import { OpenPeerDeployer } from 'abis';
import { BigNumber, constants } from 'ethers';
import { toBn } from 'evm-bn';
import { DEPLOYER_CONTRACTS } from 'models/networks';
import { Token } from 'models/types';
import { useContractReads, useNetwork } from 'wagmi';
import { polygon } from 'wagmi/chains';

interface UseEscrowFeeParams {
	address?: `0x${string}`;
	token: Token | undefined;
	tokenAmount: number | undefined;
}

const useEscrowFee = ({ address, tokenAmount, token }: UseEscrowFeeParams) => {
	const { chain, chains } = useNetwork();
	const deployer = DEPLOYER_CONTRACTS[(chain || chains[0] || polygon).id];
	const contract = address || deployer;
	const partner = constants.AddressZero;

	const { data, isFetching } = useContractReads({
		contracts: [
			{
				address: contract,
				abi: OpenPeerDeployer,
				functionName: 'sellerFee',
				args: [partner]
			},
			{
				address: contract,
				abi: OpenPeerDeployer,
				functionName: 'openPeerFee'
			}
		]
	});

	if (isFetching || !token || !tokenAmount) return { isFetching };

	const [feeBps, openPeerFeeBps] = data as [BigNumber, BigNumber];

	const rawTokenAmount = toBn(String(tokenAmount), token.decimals);
	const fee = rawTokenAmount.mul(feeBps as BigNumber).div(BigNumber.from('10000'));
	const totalAmount = rawTokenAmount.add(fee);

	return { isFetching, fee, partnerFeeBps: feeBps.sub(openPeerFeeBps), totalAmount };
};
export default useEscrowFee;
