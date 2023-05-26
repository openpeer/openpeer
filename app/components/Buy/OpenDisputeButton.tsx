/* eslint-disable @typescript-eslint/indent */
import { OpenPeerEscrow } from 'abis';
import { Button, Modal } from 'components';
import TransactionLink from 'components/TransactionLink';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useOpenDispute, useTransactionFeedback } from 'hooks';
import { Order } from 'models/types';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount, useBalance, useContractReads } from 'wagmi';

interface OpenDisputeButtonParams {
	order: Order;
	outlined?: boolean;
	title?: string;
}

const OpenDisputeButton = ({ order, outlined = true, title = 'Open a dispute' }: OpenDisputeButtonParams) => {
	const { uuid, escrow, buyer, seller } = order;
	const { isConnected, address: connectedAddress } = useAccount();
	const isBuyer = buyer.address === connectedAddress;
	const isSeller = seller.address === connectedAddress;
	const router = useRouter();
	const escrowAddress = escrow!.address;
	const escrowContract = { address: escrowAddress, abi: OpenPeerEscrow };
	const [modalOpen, setModalOpen] = useState(false);
	const [disputeConfirmed, setDisputeConfirmed] = useState(false);

	const { data: readData = [] } = useContractReads({
		contracts: [
			{ ...escrowContract, ...{ functionName: 'sellerCanCancelAfter' } },
			{ ...escrowContract, ...{ functionName: 'disputeFee' } },
			{ ...escrowContract, ...{ functionName: 'paidForDispute', args: [connectedAddress] } }
		]
	});

	const { data: balance } = useBalance({
		address: connectedAddress
	});
	const [sellerCanCancelAfter, disputeFee, paidForDispute] = readData as [BigNumber, BigNumber, boolean];

	const { isLoading, isSuccess, openDispute, data } = useOpenDispute({ contract: escrowAddress, disputeFee });

	useTransactionFeedback({
		hash: data?.hash,
		isSuccess,
		Link: <TransactionLink hash={data?.hash} />,
		description: 'Opened a dispute'
	});

	useEffect(() => {
		if (isSuccess) {
			router.push(`/orders/${uuid}`);
		}
	}, [isSuccess, uuid]);

	useEffect(() => {
		if (disputeConfirmed) {
			onOpenDispute();
		}
	}, [disputeConfirmed]);

	if (
		sellerCanCancelAfter === undefined ||
		disputeFee === undefined ||
		paidForDispute === undefined ||
		balance?.value === undefined
	) {
		return <p>Loading...</p>;
	}

	const canOpenDispute = (isBuyer || isSeller) && parseInt(sellerCanCancelAfter.toString(), 10) === 1;

	const onOpenDispute = () => {
		if (!isConnected || !canOpenDispute) return;

		if (!disputeConfirmed) {
			setModalOpen(true);
			return;
		}

		if (disputeFee.gt(balance.value)) {
			toast.error(`You need ${formatUnits(disputeFee)} MATIC to open a dispute`, {
				theme: 'dark',
				position: 'top-right',
				autoClose: 10000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: false,
				progress: undefined
			});
		} else {
			openDispute?.();
		}
	};

	return (
		<>
			<Button
				title={
					paidForDispute
						? 'Already opened'
						: !canOpenDispute
						? 'You cannot dispute'
						: isLoading
						? 'Processing...'
						: isSuccess
						? 'Done'
						: title
				}
				processing={isLoading}
				disabled={isSuccess || !canOpenDispute || paidForDispute}
				onClick={onOpenDispute}
				outlined={outlined}
			/>
			<Modal
				actionButtonTitle="Yes, confirm"
				title="Dispute Trade"
				content="Once you dispute the trade the other party will have 24 hours to counter the dispute and send it to arbitration. A small fee of 1 MATIC is required to open a dispute. If you win the dispute the fee will be returned"
				type="confirmation"
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				onAction={() => setDisputeConfirmed(true)}
			/>
		</>
	);
};

export default OpenDisputeButton;
