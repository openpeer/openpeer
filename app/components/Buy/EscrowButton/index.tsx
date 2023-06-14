import { OpenPeerDeployer } from 'abis';
import { BigNumber, constants } from 'ethers';
import { useEscrowFee } from 'hooks';
import { DEPLOYER_CONTRACTS } from 'models/networks';
import React, { useState } from 'react';
import { useAccount, useContractRead, useNetwork } from 'wagmi';

import ApproveTokenButton from './ApproveTokenButton';
import DeploySellerContract from './DeploySellerContract';
import { EscrowFundsParams } from './EscrowButton.types';
import EscrowFundsButton from './EscrowFundsButton';

const EscrowButton = ({ token, tokenAmount, buyer, uuid }: EscrowFundsParams) => {
	const nativeToken = token.address === constants.AddressZero;
	const [approved, setApproved] = useState(nativeToken);
	const { chain } = useNetwork();
	const deployer = DEPLOYER_CONTRACTS[chain!.id];
	const { address } = useAccount();

	const { isFetching, fee, totalAmount } = useEscrowFee({ token, tokenAmount });
	const { data: sellerContract } = useContractRead({
		address: deployer,
		abi: OpenPeerDeployer,
		functionName: 'sellerContracts',
		args: [address],
		enabled: !!address,
		watch: true
	});

	if (isFetching) return <></>;

	const needsToDeploy = !sellerContract || sellerContract === constants.AddressZero;

	return (
		<span className="w-full">
			{(nativeToken || approved) && !needsToDeploy ? (
				<EscrowFundsButton
					buyer={buyer}
					fee={fee as BigNumber}
					token={token}
					tokenAmount={tokenAmount}
					uuid={uuid}
					contract={sellerContract as `0x${string}`}
				/>
			) : needsToDeploy ? (
				<DeploySellerContract />
			) : (
				<ApproveTokenButton
					token={token}
					amount={totalAmount!}
					spender={sellerContract as `0x${string}`}
					onTokenApproved={() => setApproved(true)}
				/>
			)}
		</span>
	);
};

export default EscrowButton;
