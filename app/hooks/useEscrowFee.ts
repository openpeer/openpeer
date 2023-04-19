import { OpenPeerDeployer, OpenPeerEscrow } from 'abis';
import { BigNumber } from 'ethers';
import { toBn } from 'evm-bn';
import { DEPLOYER_CONTRACTS } from 'models/networks';
import { Token } from 'models/types';
import { useContractRead, useNetwork } from 'wagmi';
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
	const fetchFeeFromDeployer = contract === deployer;

	const { data: feeBps, isFetching } = useContractRead({
		address: contract,
		abi: fetchFeeFromDeployer ? OpenPeerDeployer : OpenPeerEscrow,
		functionName: 'fee'
	});

	if (isFetching || !token || !tokenAmount) return { isFetching };

	const rawTokenAmount = toBn(String(tokenAmount), token.decimals);
	const fee = fetchFeeFromDeployer
		? rawTokenAmount.mul(feeBps as BigNumber).div(BigNumber.from('10000'))
		: (feeBps as BigNumber);
	const totalAmount = rawTokenAmount.add(fee);

	return { isFetching, fee, totalAmount };
};
export default useEscrowFee;
