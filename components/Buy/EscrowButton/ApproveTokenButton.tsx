import Button from 'components/Button/Button';
import TransactionLink from 'components/TransactionLink';
import { useTransactionFeedback, useAccount } from 'hooks';
import { useApproval } from 'hooks/transactions';
import { Token } from 'models/types';
import React, { useEffect } from 'react';
import { erc20ABI, useContractRead } from 'wagmi';

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
	const { address, isConnected } = useAccount();
	const { isFetching, isLoading, isSuccess, data, approve } = useApproval({
		token,
		spender,
		amount
	});

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

	const { data: allowance } = useContractRead({
		address: token.address,
		abi: erc20ABI,
		functionName: 'allowance',
		args: [address!, spender],
		watch: true
	});

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
