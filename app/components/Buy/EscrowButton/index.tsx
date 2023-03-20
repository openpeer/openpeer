import { BigNumber, constants } from 'ethers';
import { useEscrowFee } from 'hooks';
import { DEPLOYER_CONTRACTS } from 'models/networks';
import { useState } from 'react';
import { useNetwork } from 'wagmi';

import ApproveTokenButton from './ApproveTokenButton';
import { EscrowFundsParams } from './EscrowButton.types';
import EscrowFundsButton from './EscrowFundsButton';

const EscrowButton = ({ token, tokenAmount, buyer, uuid }: EscrowFundsParams) => {
	const nativeToken = token.address === constants.AddressZero;
	const [approved, setApproved] = useState(nativeToken);
	const { chain } = useNetwork();
	const spender = DEPLOYER_CONTRACTS[chain!.id];

	const { isFetching, fee, totalAmount } = useEscrowFee({ token, tokenAmount });

	if (isFetching) return <></>;

	return (
		<span className="w-full">
			{nativeToken || approved ? (
				<EscrowFundsButton
					buyer={buyer}
					fee={fee as BigNumber}
					token={token}
					tokenAmount={tokenAmount}
					uuid={uuid}
				/>
			) : (
				<ApproveTokenButton
					token={token}
					amount={totalAmount!}
					spender={spender}
					onTokenApproved={() => setApproved(true)}
				/>
			)}
		</span>
	);
};

export default EscrowButton;
