import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react';

import Head from 'app/head';
import { TransactionFeedbackProvider } from 'contexts/TransactionFeedContext';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { MessageContextProvider } from 'contexts/MessageContext';

const Layout = dynamic(() => import('../components/layout'), { ssr: false });
const NoAuthLayout = dynamic(() => import('../components/NoAuthLayout'), { ssr: false });

const App = ({ Component, pageProps }: AppProps) => {
	const { simpleLayout } = pageProps;
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
						{simpleLayout ? (
							// @ts-expect-error
							<NoAuthLayout pageProps={pageProps} Component={Component} />
						) : (
							// @ts-expect-error
							<Layout pageProps={pageProps} Component={Component} />
						)}
					</TransactionFeedbackProvider>
				</MessageContextProvider>
			</DynamicWagmiConnector>
		</DynamicContextProvider>
	);
};

export default App;
