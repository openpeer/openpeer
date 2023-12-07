import { OpenPeerDeployer } from 'abis';
import { constants } from 'ethers';
import { useEscrowFee, useNetwork } from 'hooks';
import { DEPLOYER_CONTRACTS } from 'models/networks';
import React, { useEffect, useState } from 'react';
import useAccount from 'hooks/useAccount';

import { readContract } from '@wagmi/core';
import { tronWebClient } from 'utils';
import ApproveTokenButton from './ApproveTokenButton';
import DeploySellerContract from './DeploySellerContract';
import { EscrowFundsParams } from './EscrowButton.types';
import EscrowFundsButton from './EscrowFundsButton';

const EscrowButton = ({
	token,
	tokenAmount,
	buyer,
	seller,
	uuid,
	instantEscrow,
	sellerWaitingTime
}: EscrowFundsParams) => {
	const nativeToken = token.address === constants.AddressZero;
	const [approved, setApproved] = useState(nativeToken || instantEscrow);
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
					chainId: token.chain_id
				});

				setSellerContract(contract as `0x${string}` | undefined);
			} else {
				const tronWeb = tronWebClient(chain);
				const deployerContract = await tronWeb.contract(OpenPeerDeployer, deployer);
				const contract = await deployerContract.sellerContracts(instantEscrow ? seller : address).call();
				console.log('contract', contract);
				setSellerContract(contract as string | undefined);
			}
		};

		fetchSellerContract();
	}, [evm]);

	const { isFetching, fee, totalAmount } = useEscrowFee({
		address: sellerContract as `0x${string}` | undefined,
		token,
		tokenAmount,
		chainId: token.chain_id
	});

	if (isFetching || !fee) return <></>;

	console.log('sellerContract', sellerContract);

	const needsToDeploy =
		!instantEscrow &&
		(!sellerContract ||
			sellerContract === constants.AddressZero ||
			sellerContract === '410000000000000000000000000000000000000000');

	console.log('nativeToken', nativeToken);
	console.log('approved', approved);
	console.log('needsToDeploy', needsToDeploy);
	return (
		<span className="w-full">
			{(nativeToken || approved) && !needsToDeploy ? (
				<EscrowFundsButton
					buyer={buyer}
					fee={fee}
					token={token}
					tokenAmount={tokenAmount}
					uuid={uuid}
					contract={sellerContract as `0x${string}`}
					seller={seller}
					instantEscrow={instantEscrow}
					sellerWaitingTime={sellerWaitingTime}
				/>
			) : (
				needsToDeploy && <DeploySellerContract />
			)}
			{!instantEscrow && !nativeToken && (
				<div className={nativeToken || approved || needsToDeploy ? 'hidden' : ''}>
					<ApproveTokenButton
						token={token}
						amount={totalAmount!}
						spender={sellerContract as `0x${string}`}
						onApprovalChange={setApproved}
					/>
				</div>
			)}
		</span>
	);
};

export default EscrowButton;
