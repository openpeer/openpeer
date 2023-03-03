import { Button } from 'components';
import TransactionLink from 'components/TransactionLink';
import { useReleaseFunds, useTransactionFeedback } from 'hooks';
import { useAccount } from 'wagmi';

interface ReleaseFundsButtonParams {
	escrow: `0x${string}`;
	title?: string;
}

const ReleaseFundsButton = ({ escrow, title = 'Release funds' }: ReleaseFundsButtonParams) => {
	const { isConnected } = useAccount();
	const { isLoading, isSuccess, data, releaseFunds } = useReleaseFunds({ escrow });

	const onReleaseFunds = () => {
		if (!isConnected) return;

		releaseFunds?.();
	};

	useTransactionFeedback({
		hash: data?.hash,
		isSuccess,
		Link: <TransactionLink hash={data?.hash} />
	});

	return (
		<Button
			title={isLoading ? 'Processing...' : isSuccess ? 'Done' : title}
			processing={isLoading}
			disabled={isSuccess}
			onClick={onReleaseFunds}
		/>
	);
};

export default ReleaseFundsButton;
