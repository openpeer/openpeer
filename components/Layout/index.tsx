import 'react-toastify/dist/ReactToastify.css';
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
import TronProvider from 'providers/TronProvider';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { MagicWalletConnectors } from '@dynamic-labs/magic';

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
				eventsCallbacks: {
					onSignedMessage: async ({ messageToSign: msg, signedMessage: signature }) => {
						setMessageToSign(msg);
						setSignedMessage(signature);
					},
					onLogout: () => {
						setMessageToSign('');
						setSignedMessage('');
					}
				}
			}}
		>
			<DynamicWagmiConnector>
				<TronProvider>
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
				</TronProvider>
			</DynamicWagmiConnector>
		</DynamicContextProvider>
	);
};

export default App;
