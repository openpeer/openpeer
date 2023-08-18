import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { GetServerSideProps } from 'next';
import React from 'react';
import { useAccount } from 'wagmi';

const WalletChatTest = () => {
	const { address } = useAccount();
	return (
		<div>
			<h1>{address}</h1>
			<DynamicWidget />
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async () => ({
	props: {
		title: 'Wallet Chat Test',
		simpleLayout: true
	}
});

export default WalletChatTest;
