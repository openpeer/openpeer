import { Button } from 'components';
import { verifyMessage } from 'ethers/lib/utils.js';
import { Order } from 'models/types';
import { useAccount, useSignMessage } from 'wagmi';

import BlockchainCancelButton from './BlockchainCancelButton';

interface CancelOrderButtonParams {
	order: Order;
	outlined?: boolean;
	title?: string;
}

const CancelOrderButton = ({ order, outlined = true, title = 'Cancel Order' }: CancelOrderButtonParams) => {
	const {
		list: { seller },
		buyer,
		uuid
	} = order;

	const { address } = useAccount();

	const isBuyer = buyer.address === address;
	const isSeller = seller.address === address;
	const message = `Cancel order ${uuid}`;

	const { signMessage } = useSignMessage({
		onSuccess: async (data, variables) => {
			const signingAddress = verifyMessage(variables.message, data);
			if (signingAddress === address) {
				const result = await fetch(`/api/orders/${uuid}/cancel`, {
					method: 'PATCH',
					body: message
				});
				const order = await result.json();
				if (!order.uuid) {
					// @TODO: Marcos - handle error
				}
			}
		}
	});

	const cancelIsNotAvailable = ['cancelled', 'closed'].includes(order.status);
	const simpleCancel: boolean = !order.escrow && order.status === 'created'; // no need to talk to the blockchain

	const onCancelOrder = () => {
		// 'created' | 'escrowed' | 'release' | 'cancelled' | 'dispute' | 'closed';
		if (cancelIsNotAvailable) return;

		if (simpleCancel) {
			signMessage({ message });
		}
	};

	if ((!isBuyer && !isSeller) || cancelIsNotAvailable) return <></>;

	return simpleCancel ? (
		<Button title={title} onClick={onCancelOrder} outlined={outlined} />
	) : (
		<BlockchainCancelButton order={order} title={title} outlined={outlined} />
	);
};

export default CancelOrderButton;
