import { Button, Modal } from 'components';
import TransactionLink from 'components/TransactionLink';
import { useTransactionFeedback, useAccount } from 'hooks';
import { useEscrowFunds } from 'hooks/transactions';
import React, { useEffect, useState } from 'react';
import { truncate } from 'utils';
import { parseUnits } from 'viem';

import { EscrowFundsButtonProps } from './EscrowButton.types';

const EscrowFundsButton = ({
	uuid,
	buyer,
	token,
	tokenAmount,
	fee,
	contract,
	instantEscrow,
	sellerWaitingTime
}: EscrowFundsButtonProps) => {
	const { isConnected } = useAccount();
	const amount = parseUnits(String(truncate(tokenAmount, token.decimals)), token.decimals);
	const [modalOpen, setModalOpen] = useState(false);
	const [escrowConfirmed, setEscrowConfirmed] = useState(false);

	const { isLoading, isSuccess, data, escrowFunds, isFetching } = useEscrowFunds({
		orderID: uuid!,
		amount,
		buyer,
		fee,
		token,
		contract,
		instantEscrow,
		sellerWaitingTime
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
		Link: <TransactionLink hash={data?.hash} />,
		description: instantEscrow ? 'Confirmed the order' : 'Escrowed funds'
	});

	return (
		<>
			<Button
				title={
					isLoading ? 'Processing...' : isSuccess ? 'Done' : instantEscrow ? 'Confirm Order' : 'Escrow funds'
				}
				onClick={escrow}
				processing={isLoading || isFetching}
				disabled={isSuccess || isFetching}
			/>
			<Modal
				actionButtonTitle="Yes, confirm"
				title={instantEscrow ? 'Confirm order?' : 'Escrow funds?'}
				content={`The funds will be ${
					instantEscrow ? 'locked in the' : 'sent to your'
				} escrow contract (${contract}).`}
				type="confirmation"
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				onAction={() => setEscrowConfirmed(true)}
			/>
		</>
	);
};

export default EscrowFundsButton;
