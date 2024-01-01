import { DEPLOYER_CONTRACTS } from 'models/networks';
import { useEffect, useState } from 'react';
import { readContract } from '@wagmi/core';
import { OpenPeerDeployer } from 'abis';
import { tronWebClient } from 'utils';
import useNetwork from './useNetwork';
import useAccount from './useAccount';

interface UseSellerContractProps {
	seller: `0x${string}` | undefined;
	instantEscrow: boolean;
	chainId: number;
}

const useSellerContract = ({ seller, instantEscrow, chainId }: UseSellerContractProps) => {
	const { chain } = useNetwork();
	const deployer = chain ? DEPLOYER_CONTRACTS[chain?.id || 0] : undefined;
	const { address, evm } = useAccount();
	const [sellerContract, setSellerContract] = useState<string | `0x${string}` | undefined>();

	useEffect(() => {
		const fetchSellerContract = async () => {
			if (!deployer || !chain) return;

			if (evm) {
				const contract = await readContract({
					address: deployer,
					abi: OpenPeerDeployer,
					functionName: 'sellerContracts',
					args: [instantEscrow ? seller : address],
					chainId
				});

				setSellerContract(contract as `0x${string}` | undefined);
			} else {
				const tronWeb = tronWebClient(chain);
				const deployerContract = await tronWeb.contract(OpenPeerDeployer, deployer);
				let contract = await deployerContract.sellerContracts(instantEscrow ? seller : address).call();
				if (contract) {
					contract = tronWeb.address.fromHex(contract);
				}
				setSellerContract(contract as string | undefined);
			}
		};

		fetchSellerContract();
	}, [evm, seller, address, chain]);

	return { sellerContract };
};

export default useSellerContract;
