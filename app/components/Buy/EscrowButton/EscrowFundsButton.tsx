import { Button, Modal } from 'components';
import TransactionLink from 'components/TransactionLink';
import { toBn } from 'evm-bn';
import { useTransactionFeedback } from 'hooks';
import { useEscrowFunds } from 'hooks/transactions';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { EscrowFundsButton } from './EscrowButton.types';

const EscrowFundsButton = ({ uuid, buyer, token, tokenAmount, fee }: EscrowFundsButton) => {
	const { isConnected } = useAccount();
	const amount = toBn(String(tokenAmount), token.decimals);
	const [modalOpen, setModalOpen] = useState(false);
	const [escrowConfirmed, setEscrowConfirmed] = useState(false);

	const { isLoading, isSuccess, data, escrowFunds } = useEscrowFunds({
		orderID: uuid!,
		amount,
		buyer,
		fee,
		token
	});

	const escrow = () => {
		if (!isConnected) return;

		if (!escrowConfirmed) {
			setModalOpen(true);
			return;
		}
		escrowFunds?.();
	};

	useEffect(() => {
		if (escrowConfirmed) {
			escrow();
		}
	}, [escrowConfirmed]);

	useTransactionFeedback({
		hash: data?.hash,
		isSuccess,
		Link: <TransactionLink hash={data?.hash} />
	});

	return (
		<>
			<Button
				title={isLoading ? 'Processing...' : isSuccess ? 'Done' : 'Escrow funds'}
				onClick={escrow}
				processing={isLoading}
				disabled={isSuccess}
			/>
			<Modal
				actionButtonTitle="Yes, confirm"
				title="Escrow funds?"
				content="The funds will be sent to a new escrow contract."
				type="confirmation"
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				onAction={() => setEscrowConfirmed(true)}
			/>
		</>
	);
};

export default EscrowFundsButton;
