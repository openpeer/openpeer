import { Button } from 'components';
import useEscrowContract from 'hooks/useEscrowContract';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

interface MarkAsPaidButtonParams {
	escrowAddress: `0x${string}`;
	onFinished?: () => void;
}

const MarkAsPaidButton = ({ escrowAddress, onFinished }: MarkAsPaidButtonParams) => {
	const { isConnected } = useAccount();

	const { isLoading, isSuccess, data, markAsPaid } = useEscrowContract({ address: escrowAddress });

	const onPaymentDone = () => {
		if (!isConnected) return;
		markAsPaid?.();
	};

	useEffect(() => {
		onFinished?.();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess]);

	return (
		<span className="w-full">
			<Button title="I've made the payment" onClick={onPaymentDone} />
		</span>
	);
};

export default MarkAsPaidButton;
