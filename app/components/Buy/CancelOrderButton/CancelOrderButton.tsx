import { Button, Checkbox, Input, Modal } from 'components';
import { verifyMessage } from 'ethers/lib/utils';
import { Order } from 'models/types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount, useSignMessage } from 'wagmi';

import BlockchainCancelButton from './BlockchainCancelButton';

interface CancelOrderButtonParams {
	order: Order;
	outlined?: boolean;
	title?: string;
}

const CancelOrderButton = ({ order, outlined = true, title = 'Cancel Order' }: CancelOrderButtonParams) => {
	const { seller, buyer, uuid } = order;

	const { address } = useAccount();

	const isBuyer = buyer.address === address;
	const isSeller = seller.address === address;
	const message = `Cancel order ${uuid}`;

	const [modalOpen, setModalOpen] = useState(false);
	const [cancelConfirmed, setCancelConfirmed] = useState(false);

	const { signMessage } = useSignMessage({
		onSuccess: async (data, variables) => {
			const signingAddress = verifyMessage(variables.message, data);
			if (signingAddress === address) {
				const result = await fetch(`/api/orders/${uuid}/cancel`, {
					method: 'PATCH',
					body: message
				});
				const savedOrder = await result.json();
				if (!savedOrder.uuid) {
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
			<Modal
				actionButtonTitle="Yes, confirm"
				title="Cancel Order?"
				content={
					<>
						<div className="text-base text-left mt-4 text-gray-700 font-medium">
							What is the reason for your wish to cancel?
						</div>
						<Checkbox content="Trade took too long to complete" id="tooLong" name="cencelReason" />
						<Checkbox
							content="Other trader hasn't completed next steps"
							id="hasntCompleated"
							name="cencelReason"
						/>
						<Checkbox
							content="Don't want to trade with other trader"
							id="dontWantToTrade"
							name="cencelReason"
						/>
						<Checkbox content="Don't understand OpenPeer" id="DontUnderstandOpenPeer" name="cencelReason" />
						<Checkbox content="Other" id="cancelReasonOther" name="cencelReason" />
						<Input
							label="Please, tell us why you're cancelling"
							id="cancelReasonDescription"
							containerExtraStyle="my-2"
						/>
					</>
				}
				type="alert"
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				onAction={() => setCancelConfirmed(true)}
			/>
		</>
	) : (
		<BlockchainCancelButton order={order} title={title} outlined={outlined} />
	);
};

export default CancelOrderButton;
