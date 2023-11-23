import { getAuthToken } from '@dynamic-labs/sdk-react';
import { Button, ModalWindow } from 'components';
import { useCancelReasons, useConfirmationSignMessage, useAccount } from 'hooks';
import { Order } from 'models/types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import BlockchainCancelButton from './BlockchainCancelButton';
import CancelReasons from './CancelReasons';

interface CancelOrderButtonParams {
	order: Order;
	outlined?: boolean;
	title?: string;
}

const CancelOrderButton = ({ order, outlined = true, title = 'Cancel Order' }: CancelOrderButtonParams) => {
	const { seller, buyer, uuid, status } = order;

	const { address } = useAccount();
	const { cancellation, otherReason, setOtherReason, toggleCancellation } = useCancelReasons();

	const isBuyer = buyer.address === address;
	const isSeller = seller.address === address;
	const message = `Cancel order ${uuid}`;

	const [modalOpen, setModalOpen] = useState(false);
	const [cancelConfirmed, setCancelConfirmed] = useState(false);

	const { signMessage } = useConfirmationSignMessage({
		onSuccess: async () => {
			const result = await fetch(`/api/orders/${uuid}/cancel`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${getAuthToken()}`
				},
				body: JSON.stringify({
					cancellation,
					other_reason: otherReason && otherReason !== '' ? otherReason : undefined
				})
			});
			const savedOrder = await result.json();
			if (savedOrder.uuid) {
				if (status !== 'cancelled') {
					window.location.reload();
				}
			} else {
				toast.error('Error cancelling the order', {
					theme: 'dark',
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: false,
					progress: undefined
				});
			}
		}
	});

	const cancelIsNotAvailable = ['cancelled', 'closed'].includes(order.status);
	const simpleCancel: boolean = !order.escrow && order.status === 'created'; // no need to talk to the blockchain

	const onCancelOrder = () => {
		if (cancelIsNotAvailable) return;

		if (!cancelConfirmed) {
			setModalOpen(true);
			return;
		}

		if (simpleCancel) {
			signMessage({ message });
		}
	};

	useEffect(() => {
		if (cancelConfirmed) {
			onCancelOrder();
		}
	}, [cancelConfirmed]);

	if ((!isBuyer && !isSeller) || cancelIsNotAvailable) return <></>;

	return simpleCancel ? (
		<>
			<Button title={title} onClick={onCancelOrder} outlined={outlined} />
			<ModalWindow
				actionButtonTitle="Yes, confirm"
				title="Cancel Order?"
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
	) : (
		<BlockchainCancelButton order={order} title={title} outlined={outlined} />
	);
};

export default CancelOrderButton;
