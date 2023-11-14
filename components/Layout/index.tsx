import 'tailwindcss/tailwind.css';
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react';

import Head from 'app/head';
import { TransactionFeedbackProvider } from 'contexts/TransactionFeedContext';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { MessageContextProvider } from 'contexts/MessageContext';
import ChatProvider from 'providers/ChatProvider';

const AuthLayout = dynamic(() => import('./AuthLayout'), { ssr: false });
const NoAuthLayout = dynamic(() => import('./NoAuthLayout'), { ssr: false });
const TronLayout = dynamic(() => import('./tron/TronLayout'), { ssr: false });

const App = ({ Component, pageProps }: AppProps) => {
	const { simpleLayout, tron } = pageProps;
	const [messageToSign, setMessageToSign] = useState('');
	const [signedMessage, setSignedMessage] = useState('');

	return (
		<DynamicContextProvider
			settings={{
				environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
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
				<MessageContextProvider messageToSign={messageToSign} signedMessage={signedMessage}>
					<TransactionFeedbackProvider>
						<Head />
						{tron ? (
							// @ts-expect-error
							<TronLayout pageProps={pageProps} Component={Component} />
						) : simpleLayout ? (
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
