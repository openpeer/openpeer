import { constants } from 'ethers';
import { useEscrowFee, useSellerContract } from 'hooks';
import React, { useState } from 'react';

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
	const { sellerContract } = useSellerContract({
		seller,
		instantEscrow,
		chainId: token.chain_id
	});

	const { isFetching, fee, totalAmount } = useEscrowFee({
		address: sellerContract as `0x${string}` | undefined,
		token,
		tokenAmount,
		chainId: token.chain_id
	});

	if (isFetching || fee === undefined) return <></>;

	const needsToDeploy =
		!instantEscrow &&
		(!sellerContract ||
			sellerContract === constants.AddressZero ||
			sellerContract === '410000000000000000000000000000000000000000');

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
