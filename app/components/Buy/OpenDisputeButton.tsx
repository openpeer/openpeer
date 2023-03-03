import { OpenPeerEscrow } from 'abis';
import { Button } from 'components';
import TransactionLink from 'components/TransactionLink';
import { BigNumber } from 'ethers';
import { useOpenDispute, useTransactionFeedback } from 'hooks';
import { Order } from 'models/types';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAccount, useContractReads } from 'wagmi';

interface OpenDisputeButtonParams {
	order: Order;
	outlined?: boolean;
	title?: string;
}

const OpenDisputeButton = ({ order, outlined = true, title = 'Open a dispute' }: OpenDisputeButtonParams) => {
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
	const escrowAddress = escrow!.address;
	const escrowContract = { address: escrowAddress, abi: OpenPeerEscrow };

	const { data: readData = [] } = useContractReads({
		contracts: [
			{ ...escrowContract, ...{ functionName: 'sellerCanCancelAfter' } },
			{ ...escrowContract, ...{ functionName: 'disputeFee' } },
			{ ...escrowContract, ...{ functionName: 'paidForDispute', args: [connectedAddress] } }
		]
	});
	const [sellerCanCancelAfter, disputeFee, paidForDispute] = readData as [BigNumber, BigNumber, boolean];

	const { isLoading, isSuccess, openDispute, data } = useOpenDispute({ contract: escrowAddress, disputeFee });

	useTransactionFeedback({
		hash: data?.hash,
		isSuccess,
		Link: <TransactionLink hash={data?.hash} />
	});

	useEffect(() => {
		if (isSuccess) {
			router.push(`/orders/${uuid}`);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess, uuid]);

	if (sellerCanCancelAfter === undefined || disputeFee === undefined || paidForDispute === undefined) {
		return <p>Loading...</p>;
	}

	const canOpenDispute = (isBuyer || isSeller) && parseInt(sellerCanCancelAfter.toString()) == 1;

	const onOpenDispute = () => {
		if (!isConnected || !canOpenDispute) return;

		openDispute?.();
	};

	return (
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
	);
};

export default OpenDisputeButton;
