import { Button, Modal } from 'components';
import TransactionLink from 'components/TransactionLink';
import { useTransactionFeedback } from 'hooks';
import { useReleaseFunds } from 'hooks/transactions';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface ReleaseFundsButtonParams {
	escrow: `0x${string}`;
	title?: string;
	outlined?: boolean;
	dispute: boolean;
}

const ReleaseFundsButton = ({
	escrow,
	dispute,
	outlined = false,
	title = 'Release funds'
}: ReleaseFundsButtonParams) => {
	const { isConnected } = useAccount();
	const { isLoading, isSuccess, data, releaseFunds } = useReleaseFunds({ contract: escrow });
	const [modalOpen, setModalOpen] = useState(false);
	const [releaseConfirmed, setReleaseConfirmed] = useState(false);

	const onReleaseFunds = () => {
		if (!isConnected) return;

		if (!releaseConfirmed) {
			setModalOpen(true);
			return;
		}

		releaseFunds?.();
	};

	useTransactionFeedback({
		hash: data?.hash,
		isSuccess,
		Link: <TransactionLink hash={data?.hash} />
	});

	useEffect(() => {
		if (releaseConfirmed) {
			onReleaseFunds();
		}
	}, [releaseConfirmed]);

	return (
		<>
			<Button
				title={isLoading ? 'Processing...' : isSuccess ? 'Done' : title}
				processing={isLoading}
				disabled={isSuccess}
				onClick={onReleaseFunds}
				outlined={outlined}
			/>

			<Modal
				actionButtonTitle="Yes, confirm"
				title={dispute ? 'Are you sure?' : 'Are you sure you have received this payment in your account?'}
				content={
					dispute
						? 'This will send the funds escrowed to the buyer!'
						: 'Ensure you have received the exact amount before confirming this payment. failure to do so may result in permanent loss of funds.'
				}
				type="confirmation"
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				onAction={() => setReleaseConfirmed(true)}
			/>
		</>
	);
};

export default ReleaseFundsButton;
