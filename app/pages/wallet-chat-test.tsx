import { Chat } from 'components/Buy';
import { GetServerSideProps } from 'next';
import React from 'react';

const WalletChatTest = () => <Chat label="seller" address="0xB98206A86e61bc59E9632D06679a5515eBf02e81" />;

export const getServerSideProps: GetServerSideProps = async () => ({
	props: {
		title: 'Wallet Chat Test'
	}
});

export default WalletChatTest;
