import { OpenPeerDeployer } from 'abis';
import { constants } from 'ethers';
import { useEscrowFee, useNetwork } from 'hooks';
import { DEPLOYER_CONTRACTS } from 'models/networks';
import React, { useState } from 'react';
import { useContractRead } from 'wagmi';
import useAccount from 'hooks/useAccount';

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
	const deployer = chain ? DEPLOYER_CONTRACTS[chain.id] : undefined;
	const { address } = useAccount();

	const { data: sellerContract } = useContractRead({
		address: deployer,
		abi: OpenPeerDeployer,
		functionName: 'sellerContracts',
		args: [instantEscrow ? seller : address],
		enabled: !!address,
		watch: true
	});

	const { isFetching, fee, totalAmount } = useEscrowFee({
		address: sellerContract as `0x${string}` | undefined,
		token,
		tokenAmount,
		chainId: token.chain_id
	});

	if (isFetching || !fee) return <></>;

	const needsToDeploy = !instantEscrow && (!sellerContract || sellerContract === constants.AddressZero);

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
				<div className={nativeToken || approved ? 'hidden' : ''}>
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
