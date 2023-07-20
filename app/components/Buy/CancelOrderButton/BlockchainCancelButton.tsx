import { OpenPeerEscrow } from 'abis';
import { Button, Modal } from 'components';
import TransactionLink from 'components/TransactionLink';
import { useCancelReasons, useTransactionFeedback } from 'hooks';
import { useEscrowCancel } from 'hooks/transactions';
import { Order } from 'models/types';
import React, { useEffect, useState } from 'react';
import { parseUnits } from 'viem';
import { useAccount, useContractRead } from 'wagmi';

import CancelReasons from './CancelReasons';

interface BlockchainCancelButtonParams {
	order: Order;
	outlined?: boolean;
	title?: string;
}
const BlockchainCancelButton = ({ order, outlined, title = 'Cancel Order' }: BlockchainCancelButtonParams) => {
	const { escrow, buyer, seller, trade_id: tradeId, uuid, list, token_amount: tokenAmount } = order;
	const { token } = list;
	const { isConnected, address: connectedAddress } = useAccount();
	const { cancellation, otherReason, setOtherReason, toggleCancellation } = useCancelReasons();
	const isBuyer = buyer.address === connectedAddress;
	const isSeller = seller.address === connectedAddress;
	const [modalOpen, setModalOpen] = useState(false);
	const [cancelConfirmed, setCancelConfirmed] = useState(false);

	const { data: escrowData, isFetching: isFetchingEscrowData } = useContractRead({
		address: escrow!.address,
		abi: OpenPeerEscrow,
		functionName: 'escrows',
		args: [tradeId]
	});

	const { isLoading, isSuccess, cancelOrder, data, isFetching } = useEscrowCancel({
		contract: escrow!.address,
		orderID: uuid,
		buyer: buyer.address,
		token,
		amount: parseUnits(String(tokenAmount), token.decimals),
		isBuyer
	});

	useTransactionFeedback({
		hash: data?.hash,
		isSuccess,
		Link: <TransactionLink hash={data?.hash} />,
		description: 'Cancelled the order'
	});

	useEffect(() => {
		if (cancelConfirmed) {
			onBlockchainCancel();
		}
	}, [cancelConfirmed]);

	useEffect(() => {
		const saveCancellationReasons = async () => {
			await fetch(`/api/orders/${uuid}/cancel`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					cancellation,
					other_reason: otherReason && otherReason !== '' ? otherReason : undefined
				})
			});
		};

		if (isSuccess) {
			saveCancellationReasons();
		}
	}, [isSuccess]);

	if (isFetchingEscrowData) {
		return <p>Loading...</p>;
	}

	const [, sellerCanCancelAfter] = escrowData as [boolean, bigint];

	const now = Date.now() / 1000;
	const sellerCanCancelAfterSeconds = parseInt(sellerCanCancelAfter.toString(), 10);
	const sellerCantCancel = isSeller && (sellerCanCancelAfterSeconds <= 1 || sellerCanCancelAfterSeconds > now);

	const onBlockchainCancel = () => {
		if (!isConnected || sellerCantCancel) return;

		if (!cancelConfirmed) {
			setModalOpen(true);
			return;
		}

		cancelOrder?.();
	};

	return (
		<>
			<Button
				title={
					sellerCantCancel ? 'You cannot cancel' : isLoading ? 'Processing...' : isSuccess ? 'Done' : title
				}
				processing={isLoading || isFetching}
				disabled={isSuccess || sellerCantCancel || sellerCantCancel || isFetching}
				onClick={onBlockchainCancel}
				outlined={outlined}
			/>
			<>
				<Modal
					actionButtonTitle="Yes, confirm"
					title={
						<div className="flex flex-col">
							<div>Cancel Order?</div>
							<div>The escrowed funds will return to {isBuyer ? 'the seller' : 'you'}.</div>
						</div>
					}
					content={
						<CancelReasons
							setOtherReason={setOtherReason}
							toggleCancellation={toggleCancellation}
							showOtherReason={cancellation.other}
						/>
					}
					type="alert"
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					onAction={() => setCancelConfirmed(true)}
					actionDisabled={Object.keys(cancellation).length === 0 || (cancellation.other && !otherReason)}
				/>
			</>
		</>
	);
};

export default BlockchainCancelButton;
