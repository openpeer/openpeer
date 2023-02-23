import { Button } from 'components';
import TransactionLink from 'components/TransactionLink';
import { BigNumber } from 'ethers';
import { useOpenDispute, useTransactionFeedback } from 'hooks';
import { Order } from 'models/types';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAccount, useContractRead } from 'wagmi';

import OpenPeerEscrow from '../../abis/OpenPeerEscrow.json';

interface OpenDisputeButtonParams {
	order: Order;
}

const OpenDisputeButton = ({ order }: OpenDisputeButtonParams) => {
	const {
		uuid,
		escrow,
		buyer,
		list: { seller }
	} = order;
	const { isConnected, address: connectedAddress } = useAccount();
	const isBuyer = buyer.address === connectedAddress;
	const isSeller = seller.address === connectedAddress;
	const router = useRouter();

	const { data: sellerCanCancelAfter }: { data: BigNumber | undefined } = useContractRead({
		address: escrow.address,
		abi: OpenPeerEscrow,
		functionName: 'sellerCanCancelAfter'
	});

	const { isLoading, isSuccess, openDispute, data } = useOpenDispute({ contract: escrow.address });

	useTransactionFeedback({
		hash: data?.hash,
		isSuccess,
		Link: <TransactionLink hash={data?.hash} />
	});

	useEffect(() => {
		if (isSuccess) {
			router.push(`/dispute/${uuid}`);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess, uuid]);

	if (sellerCanCancelAfter === undefined) {
		return <p>Loading...</p>;
	}

	const canOpenDispute = (isBuyer || isSeller) && parseInt(sellerCanCancelAfter.toString()) == 1;

	const onOpenDispute = () => {
		console.log({ isConnected, canOpenDispute });
		if (!isConnected || !canOpenDispute) return;

		openDispute?.();
	};

	return (
		<Button
			title={
				!canOpenDispute
					? 'You cannot dispute'
					: isLoading
					? 'Processing...'
					: isSuccess
					? 'Done'
					: 'Open a dispute'
			}
			processing={isLoading}
			disabled={isSuccess || !canOpenDispute}
			onClick={onOpenDispute}
			outlined
		/>
	);
};

export default OpenDisputeButton;
