import { BigNumber, constants } from 'ethers';
import { toBn } from 'evm-bn';
import { DEPLOYER_CONTRACTS } from 'hooks/useCreateContract';
import { useState } from 'react';
import { useAccount, useContractRead, useNetwork } from 'wagmi';

import OpenPeerDeployer from '../../../abis/OpenPeerDeployer.json';
import ApproveTokenButton from './ApproveTokenButton';
import { EscrowFundsParams } from './EscrowButton.types';
import EscrowFundsButton from './EscrowFundsButton';

const EscrowButton = ({ token, tokenAmount, buyer, uuid }: EscrowFundsParams) => {
	const { address } = useAccount();
	const { chain } = useNetwork();
	const nativeToken = token.address === constants.AddressZero;
	const spender = DEPLOYER_CONTRACTS[chain!.id];

	const { data: feeBps } = useContractRead({
		address: spender,
		abi: OpenPeerDeployer,
		functionName: 'fee'
	});

	const rawTokenAmount = toBn(String(tokenAmount), token.decimals);
	const fee = rawTokenAmount.mul(feeBps as BigNumber).div(BigNumber.from('10000'));
	const amount = rawTokenAmount.add(fee);
	const [approved, setApproved] = useState(nativeToken);

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
					amount={amount}
					spender={spender}
					onTokenApproved={() => setApproved(true)}
				/>
			)}
		</span>
	);
};

export default EscrowButton;
