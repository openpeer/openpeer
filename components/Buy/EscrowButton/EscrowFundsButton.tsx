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
	const [escrowCreationTime, setEscrowCreationTime] = useState<number | null>(null);

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

		// Set the escrow creation time if not already set
		if (!escrowCreationTime) {
			setEscrowCreationTime(Date.now());
			console.log('Escrow creation time set:', Date.now());
		}

		// Check if 30 seconds have passed since the escrow creation time
		if (escrowCreationTime && Date.now() - escrowCreationTime < 30000) {
			console.log('30-second delay not yet passed. Current time:', Date.now());
			alert('Please wait 30 seconds before attempting to escrow funds.');
			return;
		}

		console.log('30-second delay passed. Proceeding with escrow.');
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

	const isButtonDisabled =
		isLoading ||
		isFetching ||
		isSuccess ||
		(escrowCreationTime !== null && Date.now() - escrowCreationTime < 30000);

	useEffect(() => {
		if (escrowCreationTime !== null) {
			const timeSinceCreation = (Date.now() - escrowCreationTime) / 1000; // in seconds
			if (isButtonDisabled) {
				console.log(`Button greyed out. Time since escrow creation: ${timeSinceCreation} seconds`);
			} else {
				console.log(`Button no longer greyed out. Time since escrow creation: ${timeSinceCreation} seconds`);
			}
		}
	}, [isButtonDisabled, escrowCreationTime]);

	// Log the initial state on component load
	useEffect(() => {
		if (escrowCreationTime !== null) {
			const timeSinceCreation = (Date.now() - escrowCreationTime) / 1000; // in seconds
			console.log(
				`Component loaded. Button state: ${
					isButtonDisabled ? 'greyed out' : 'active'
				}. Time since escrow creation: ${timeSinceCreation} seconds`
			);
		} else {
			console.log(
				`Component loaded. Button state: ${
					isButtonDisabled ? 'greyed out' : 'active'
				}. Escrow creation time not set.`
			);
		}
	}, []);

	return (
		<>
			<Button
				title={
					isLoading ? 'Processing...' : isSuccess ? 'Done' : instantEscrow ? 'Confirm Order' : 'Escrow funds'
				}
				onClick={escrow}
				processing={isLoading || isFetching}
				disabled={isButtonDisabled}
				className={isButtonDisabled ? 'bg-gray-400' : ''}
			/>
			<Modal
				actionButtonTitle="Yes, confirm"
				title={instantEscrow ? 'Confirm order?' : 'Escrow funds?'}
				content={`The funds will be ${
					instantEscrow ? 'locked in the' : 'sent to your'
				} escrow account (${contract}).`}
				type="confirmation"
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				onAction={() => setEscrowConfirmed(true)}
			/>
		</>
	);
};

export default EscrowFundsButton;
