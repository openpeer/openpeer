import { OpenPeerEscrow } from 'abis';
import { Button, Modal } from 'components';
import TransactionLink from 'components/TransactionLink';
import { BigNumber } from 'ethers';
import { useTransactionFeedback } from 'hooks';
import { useEscrowCancel } from 'hooks/transactions';
import { Order } from 'models/types';
import { useEffect, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';

interface BlockchainCancelButtonParams {
	order: Order;
	outlined?: boolean;
	title?: string;
}

const BlockchainCancelButton = ({ order, outlined, title = 'Cancel Order' }: BlockchainCancelButtonParams) => {
	const {
		escrow,
		buyer,
		list: { seller }
	} = order;
	const { isConnected, address: connectedAddress } = useAccount();
	const isBuyer = buyer.address === connectedAddress;
	const isSeller = seller.address === connectedAddress;
	const [modalOpen, setModalOpen] = useState(false);
	const [cancelConfirmed, setCancelConfirmed] = useState(false);

	const { data: sellerCanCancelAfter }: { data: BigNumber | undefined } = useContractRead({
		address: escrow!.address,
		abi: OpenPeerEscrow,
		functionName: 'sellerCanCancelAfter'
	});

	const { isLoading, isSuccess, cancelOrder, data } = useEscrowCancel({ contract: escrow!.address, isBuyer });

	useTransactionFeedback({
		hash: data?.hash,
		isSuccess,
		Link: <TransactionLink hash={data?.hash} />
	});

	useEffect(() => {
		if (cancelConfirmed) {
			onBlockchainCancel();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cancelConfirmed]);

	if (sellerCanCancelAfter === undefined) {
		return <p>Loading...</p>;
	}

	const now = Date.now() / 1000;
	const sellerCanCancelAfterSeconds = parseInt(sellerCanCancelAfter.toString());
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
				processing={isLoading}
				disabled={isSuccess || sellerCantCancel || sellerCantCancel}
				onClick={onBlockchainCancel}
				outlined={outlined}
			/>
			<>
				<Modal
					actionButtonTitle="Yes, confirm"
					title="Cancel Order?"
					content={`The escrowed funds will return to ${isBuyer ? 'the merchant' : 'you'}.`}
					type="alert"
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					onAction={() => setCancelConfirmed(true)}
				/>
			</>
		</>
	);
};

export default BlockchainCancelButton;
