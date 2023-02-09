import { Button } from 'components';
import TransactionLink from 'components/TransactionLink';
import { useReleaseFunds, useTransactionFeedback } from 'hooks';
import { useAccount, useNetwork } from 'wagmi';

interface ReleaseFundsButtonParams {
	address: `0x${string}`;
}

const ReleaseFundsButton = ({ address }: ReleaseFundsButtonParams) => {
	const { isConnected } = useAccount();
	const { chain } = useNetwork();
	const { isLoading, isSuccess, data, releaseFunds } = useReleaseFunds({ address });

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
			title={isLoading ? 'Processing...' : isSuccess ? 'Done' : 'Release funds'}
			processing={isLoading}
			disabled={isSuccess}
			onClick={onReleaseFunds}
		/>
	);
};

export default ReleaseFundsButton;
