import { readContract } from '@wagmi/core';
import Button from 'components/Button/Button';
import TransactionLink from 'components/TransactionLink';
import { useNetwork, useTransactionFeedback } from 'hooks';
import { useApproval } from 'hooks/transactions';
import useAccount from 'hooks/useAccount';
import { Token } from 'models/types';
import React, { useEffect, useState } from 'react';
import { tronWebClient } from 'utils';
import { erc20ABI } from 'wagmi';

const ApproveTokenButton = ({
	token,
	spender,
	amount,
	onApprovalChange
}: {
	token: Token;
	spender: `0x${string}`;
	amount: bigint;
	onApprovalChange: (approved: boolean) => void;
}) => {
	const { address, isConnected, evm } = useAccount();
	const { chain } = useNetwork();
	const { isFetching, isLoading, isSuccess, data, approve } = useApproval({
		token,
		spender,
		amount
	});

	const [allowance, setAllowance] = useState<bigint>();

	useTransactionFeedback({
		hash: data?.hash,
		isSuccess,
		Link: <TransactionLink hash={data?.hash} />,
		description: 'Approved token spending'
	});

	const approveToken = async () => {
		if (!isConnected) return;

		approve?.();
	};

	useEffect(() => {
		const fetchAllowance = async () => {
			if (!chain || !address) return;

			if (evm) {
				const lala = await readContract({
					address: token.address,
					abi: erc20ABI,
					functionName: 'allowance',
					args: [address!, spender]
				});
				// @ts-expect-error @TODO: Marcos fix this
				setAllowance(lala);
			} else {
				const tronWeb = tronWebClient(chain);
				const contract = await tronWeb.contract(erc20ABI, token.address);
				const tokenAllowance = await contract.allowance(address, spender).call();
				setAllowance(BigInt(tokenAllowance.toString()));
			}
		};

		fetchAllowance();
	}, [evm]);

	const approved = !!allowance && !!amount && allowance >= amount;

	useEffect(() => {
		onApprovalChange(isSuccess || approved);
	}, [isSuccess, approved]);

	return (
		<Button
			title={isLoading ? 'Processing...' : isSuccess ? 'Done' : `Approve ${token.symbol}`}
			onClick={approveToken}
			processing={isLoading || isFetching}
			disabled={isSuccess || isFetching || isLoading}
		/>
	);
};

export default ApproveTokenButton;
