import { Button } from 'components';
import TransactionLink from 'components/TransactionLink';
import { useMarkAsPaid, useTransactionFeedback } from 'hooks';
import { useAccount } from 'wagmi';

interface MarkAsPaidButtonParams {
	escrowAddress: `0x${string}`;
}

const MarkAsPaidButton = ({ escrowAddress }: MarkAsPaidButtonParams) => {
	const { isConnected } = useAccount();

	const { isLoading, isSuccess, data, markAsPaid } = useMarkAsPaid({ address: escrowAddress });

	const onPaymentDone = () => {
		if (!isConnected) return;
		markAsPaid?.();
	};

	useTransactionFeedback({
		hash: data?.hash,
		isSuccess,
		Link: <TransactionLink hash={data?.hash} />
	});

	return (
		<span className="w-full">
			<Button
				title={isLoading ? 'Processing...' : isSuccess ? 'Done' : "I've made the payment"}
				processing={isLoading}
				disabled={isSuccess}
				onClick={onPaymentDone}
			/>
		</span>
	);
};

export default MarkAsPaidButton;
