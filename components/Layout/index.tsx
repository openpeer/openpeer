import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';

import Head from 'app/head';
import { TransactionFeedbackProvider } from 'contexts/TransactionFeedContext';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { MessageContextProvider } from 'contexts/MessageContext';
import ChatProvider from 'providers/ChatProvider';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { MagicWalletConnectors } from '@dynamic-labs/magic';
import { blast } from 'models/networks';

const AuthLayout = dynamic(() => import('./AuthLayout'), { ssr: false });
const NoAuthLayout = dynamic(() => import('./NoAuthLayout'), { ssr: false });

const App = ({ Component, pageProps }: AppProps) => {
	const { simpleLayout } = pageProps;
	const [messageToSign, setMessageToSign] = useState('');
	const [signedMessage, setSignedMessage] = useState('');

	return (
		<DynamicContextProvider
			settings={{
				environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
				walletConnectors: [EthereumWalletConnectors, MagicWalletConnectors],
				initialAuthenticationMode: simpleLayout ? 'connect-only' : 'connect-and-sign',
				siweStatement:
					'Welcome to OpenPeer. By signing this message you accept our Terms of Service Agreement. You state the following:\n\n I am not a person or entity who reside in, are citizens of, are incorporated in, or have a registered office in the United States of America or any Prohibited Localities as defined in the Terms of Service Agreement.\n\nI will not in the future access this site or use the OpenPeer application while located in the United States or any Prohibited Localities.\n\nI am not using any software or networking techniques, including use of a Virtual Private Network (VPN) to modify my internet protocol address\n\nI am solely responsible for adhering to all laws and regulations applicable to me and my use or access to the Interface.\n\n',
				eventsCallbacks: {
					onSignedMessage: async ({ messageToSign: msg, signedMessage: signature }) => {
						setMessageToSign(msg);
						setSignedMessage(signature);
					},
					onLogout: () => {
						setMessageToSign('');
						setSignedMessage('');
					}
				},
				evmNetworks: [blast]
			}}
		>
			<DynamicWagmiConnector>
				<MessageContextProvider messageToSign={messageToSign} signedMessage={signedMessage}>
					<TransactionFeedbackProvider>
						<Head />
						{simpleLayout ? (
							// @ts-expect-error
							<NoAuthLayout pageProps={pageProps} Component={Component} />
						) : (
							<ChatProvider>
								{/* @ts-expect-error */}
								<AuthLayout pageProps={pageProps} Component={Component} />
							</ChatProvider>
						)}
					</TransactionFeedbackProvider>
				</MessageContextProvider>
			</DynamicWagmiConnector>
		</DynamicContextProvider>
	);
};

export default App;
