import { useEffect, useState } from 'react';
import { OpenPeerDeployer } from 'abis';
import { BigNumber, constants } from 'ethers';
import { DEPLOYER_CONTRACTS } from 'models/networks';
import { Token } from 'models/types';
import { Abi, parseUnits } from 'viem';
import { tron } from 'utils';
import { readContracts } from '@wagmi/core';
import tronWebClient from 'utils/tronWeb';
import useAccount from './useAccount';
import useNetwork from './useNetwork';

interface UseEscrowFeeParams {
	chainId: number | undefined;
	address?: `0x${string}`;
	token: Token | undefined;
	tokenAmount: number | undefined;
}

const useEscrowFee = ({ address, tokenAmount, token, chainId }: UseEscrowFeeParams) => {
	const { evm } = useAccount();
	const { chain } = useNetwork();
	const deployer = DEPLOYER_CONTRACTS[chainId || 0];
	const contract = !!address && address !== constants.AddressZero ? address : deployer;
	const partner = evm ? constants.AddressZero : tron.AddressZero;
	const [feeData, setFeeData] = useState<unknown[]>();

	useEffect(() => {
		const fetchData = async () => {
			if (
				!token ||
				!chainId ||
				!contract ||
				contract === constants.AddressZero ||
				contract === tron.AddressZero
			) {
				return;
			}
			if (evm) {
				const data = await readContracts({
					contracts: [
						{
							address: contract,
							abi: OpenPeerDeployer as Abi,
							functionName: 'sellerFee',
							args: [partner],
							chainId
						},
						{
							address: contract,
							abi: OpenPeerDeployer as Abi,
							functionName: 'openPeerFee',
							chainId
						}
					]
				});
				setFeeData(data);
			} else if (chain) {
				const tronWeb = tronWebClient(chain);
				const bcContract = await tronWeb.contract(OpenPeerDeployer, contract);
				const result: BigNumber = await bcContract.sellerFee(partner).call();
				const opFee: BigNumber = await bcContract.openPeerFee().call();

				setFeeData([BigInt(result.toString()), BigInt(opFee.toString())]);
			}
		};
		fetchData();
	}, [evm, chain]);

	if (!feeData || !token || !tokenAmount) return { isFetching: true };

	const [feeBps, openPeerFeeBps] = feeData || [];
	const rawTokenAmount = parseUnits(tokenAmount.toString(), token.decimals);
	const fee = (rawTokenAmount * (feeBps as bigint)) / BigInt(10000);
	const totalAmount = rawTokenAmount + fee;

	return { isFetching: false, fee, partnerFeeBps: (feeBps as bigint) - (openPeerFeeBps as bigint), totalAmount };
};
export default useEscrowFee;
