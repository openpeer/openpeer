import { Button } from 'components';
import TransactionLink from 'components/TransactionLink';
import { toBn } from 'evm-bn';
import { useTransactionFeedback } from 'hooks';
import { useMarkAsPaid } from 'hooks/transactions';
import { Order } from 'models/types';
import React from 'react';
import { useAccount } from 'wagmi';

interface MarkAsPaidButtonParams {
	order: Order;
}

const MarkAsPaidButton = ({ order }: MarkAsPaidButtonParams) => {
	const { escrow, uuid, buyer, token_amount: tokenAmount, list } = order;
	const { token } = list;
	const { isConnected } = useAccount();

	const { isLoading, isSuccess, data, markAsPaid, isFetching } = useMarkAsPaid({
		contract: escrow!.address,
		orderID: uuid,
		buyer: buyer.address,
		token,
		amount: toBn(String(tokenAmount), token.decimals)
	});

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
