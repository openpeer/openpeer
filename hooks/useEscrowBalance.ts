import { constants } from 'ethers';
import { useEffect, useState } from 'react';
import { readContract } from '@wagmi/core';
import { OpenPeerEscrow } from 'abis';
import { Token } from 'models/types';
import { tronWebClient } from 'utils';
import useNetwork from './useNetwork';
import useAccount from './useAccount';

const useEscrowBalance = (sellerContract: string | undefined, token: Token) => {
	const [balance, setBalance] = useState<bigint>();
	const { evm } = useAccount();
	const { chain } = useNetwork();

	useEffect(() => {
		const fetchBalance = async () => {
			if (!sellerContract || sellerContract === constants.AddressZero || !chain) return;
			if (evm) {
				const depositedBalance = await readContract({
					chainId: token.chain_id,
					address: sellerContract as `0x${string}`,
					abi: OpenPeerEscrow,
					functionName: 'balances',
					args: [token.address]
				});

				setBalance(depositedBalance as bigint);
			} else {
				const tronWeb = tronWebClient(chain);
				const escrowContract = await tronWeb.contract(OpenPeerEscrow, sellerContract);
				const depositedBalance = await escrowContract.balances((token as Token).address).call();
				setBalance(BigInt(depositedBalance));
			}
		};

		const intervalId = setInterval(fetchBalance, 10000); // 10000 milliseconds = 10 seconds

		// Clear interval on component unmount
		return () => clearInterval(intervalId);
	}, [sellerContract, chain]);

	return { balance };
};

export default useEscrowBalance;
