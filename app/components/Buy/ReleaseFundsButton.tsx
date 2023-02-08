import { Button } from 'components';
import { useReleaseFunds } from 'hooks';
import { useAccount } from 'wagmi';

interface ReleaseFundsButtonParams {
	address: `0x${string}`;
}

const ReleaseFundsButton = ({ address }: ReleaseFundsButtonParams) => {
	const { isConnected } = useAccount();
	const { isLoading, isSuccess, data, releaseFunds } = useReleaseFunds({ address });

	const onReleaseFunds = () => {
		if (!isConnected) return;

		releaseFunds?.();
	};

	return <Button title="Release funds" onClick={onReleaseFunds} />;
};

export default ReleaseFundsButton;
