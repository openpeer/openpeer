import { constants } from 'ethers';
import React, { useState } from 'react';

import { parseUnits } from 'viem';
import ApproveTokenButton from '../Buy/EscrowButton/ApproveTokenButton';
import { DepositFundsParams } from './DepositFundsButton.types';
import DepositFundsButton from './DepositFundsButton';

const DepositFunds = ({ token, tokenAmount, contract, disabled }: DepositFundsParams) => {
	const nativeToken = token.address === constants.AddressZero;
	const [approved, setApproved] = useState(nativeToken);

	return (
		<span className="w-full">
			{nativeToken || approved ? (
				<DepositFundsButton token={token} tokenAmount={tokenAmount} contract={contract} disabled={disabled} />
			) : (
				<ApproveTokenButton
					token={token}
					amount={parseUnits(String(tokenAmount || 0), token.decimals)}
					spender={contract}
					onTokenApproved={() => setApproved(true)}
				/>
			)}
		</span>
	);
};

export default DepositFunds;
