import { Button } from 'components';
import TransactionLink from 'components/TransactionLink';
import { useTransactionFeedback } from 'hooks';
import { useMarkAsPaid } from 'hooks/transactions';
import React from 'react';
import { useAccount } from 'wagmi';

interface MarkAsPaidButtonParams {
	escrowAddress: `0x${string}`;
}

const MarkAsPaidButton = ({ escrowAddress }: MarkAsPaidButtonParams) => {
	const { isConnected } = useAccount();

	const { isLoading, isSuccess, data, markAsPaid, isFetching } = useMarkAsPaid({ contract: escrowAddress });

	const onPaymentDone = () => {
		if (!isConnected) return;
		markAsPaid?.();
	};

	useTransactionFeedback({
		hash: data?.hash,
		isSuccess,
		Link: <TransactionLink hash={data?.hash} />,
		description: 'Marked the order as paid'
	});

	return (
		<span className="w-full">
			<Button
				title={isLoading ? 'Processing...' : isSuccess ? 'Processing transaction...' : "I've made the payment"}
				processing={isLoading || isFetching}
				disabled={isSuccess || isFetching}
				onClick={onPaymentDone}
			/>
		</span>
	);
};

export default MarkAsPaidButton;
