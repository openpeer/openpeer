import { Button } from 'components';
import TransactionLink from 'components/TransactionLink';
import { toBn } from 'evm-bn';
import { useCreateContract, useTransactionFeedback } from 'hooks';
import { useAccount } from 'wagmi';

import { EscrowFundsButton } from './EscrowButton.types';

const EscrowFundsButton = ({ uuid, buyer, token, tokenAmount, fee }: EscrowFundsButton) => {
	const { isConnected } = useAccount();
	const amount = toBn(String(tokenAmount), token.decimals);

	const { isLoading, isSuccess, data, createContract } = useCreateContract({
		orderID: uuid!,
		buyer,
		amount,
		token,
		fee
	});

	const escrow = () => {
		if (!isConnected) return;
		createContract?.();
	};

	useTransactionFeedback({
		hash: data?.hash,
		isSuccess,
		Link: <TransactionLink hash={data?.hash} />
	});

	return (
		<Button
			title={isLoading ? 'Processing...' : isSuccess ? 'Done' : 'Escrow funds'}
			onClick={escrow}
			processing={isLoading}
			disabled={isSuccess}
		/>
	);
};

export default EscrowFundsButton;
