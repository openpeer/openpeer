import { OpenPeerDeployer } from 'abis';
import { constants } from 'ethers';
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
	console.log('DEPLOYER_CONTRACTS', DEPLOYER_CONTRACTS);
	console.log('address', address);
	console.log('deployer', deployer);
	console.log('token', token);
	console.log('tokenAmount', tokenAmount);

	const { isFetching, fee, totalAmount } = useEscrowFee({ token, tokenAmount });
	console.log('fee', fee);
	console.log('totalAmount', totalAmount);
	const { data: sellerContract } = useContractRead({
		address: deployer,
		abi: OpenPeerDeployer,
		functionName: 'sellerContracts',
		args: [address],
		enabled: !!address,
		watch: true
	});

	console.log({ isFetching, sellerContract });

	if (isFetching) return <></>;
	console.log('sellerContract', sellerContract);

	const needsToDeploy = !sellerContract || sellerContract === constants.AddressZero;

	return (
		<span className="w-full">
			{(nativeToken || approved) && !needsToDeploy ? (
				<EscrowFundsButton
					buyer={buyer}
					fee={fee!}
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
