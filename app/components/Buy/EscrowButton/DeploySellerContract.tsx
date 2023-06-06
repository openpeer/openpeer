import { Button } from 'components';
import TransactionLink from 'components/TransactionLink';
import { useTransactionFeedback } from 'hooks';
import useDeploy from 'hooks/transactions/deploy/useDeploy';
import React from 'react';
import { useAccount } from 'wagmi';

const DeploySellerContract = () => {
	const { isConnected } = useAccount();

	const { isFetching, isLoading, isSuccess, data, deploy } = useDeploy();

	useTransactionFeedback({
		hash: data?.hash,
		isSuccess,
		Link: <TransactionLink hash={data?.hash} />,
		description: 'Deployed the seller contract'
	});

	const deploySellerContract = async () => {
		if (!isConnected) return;

		deploy?.();
	};

	return (
		<Button
			title={isLoading ? 'Processing...' : isSuccess ? 'Done' : 'Create My Contract'}
			onClick={deploySellerContract}
			processing={isLoading || isFetching}
			disabled={isSuccess || isFetching || isLoading}
		/>
	);
};

export default DeploySellerContract;
