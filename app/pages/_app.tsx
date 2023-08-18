import type { AppProps } from 'next/app';
import 'tailwindcss/tailwind.css';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { MagicWalletConnectors } from '@dynamic-labs/magic';
import { CoinbaseWalletConnectors } from '@dynamic-labs/coinbase';

import Head from 'app/head';
import { TransactionFeedbackProvider } from 'contexts/TransactionFeedContext';
import dynamic from 'next/dynamic';
import React from 'react';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';

const Layout = dynamic(() => import('../components/layout'), { ssr: false });
const NoAuthLayout = dynamic(() => import('../components/NoAuthLayout'), { ssr: false });

const App = ({ Component, pageProps }: AppProps) => {
	const { simpleLayout } = pageProps;
	return (
		<DynamicContextProvider
			settings={{
				environmentId: 'b7101023-4109-4abd-9eb9-777ce3d77033',
				walletConnectors: [EthereumWalletConnectors, MagicWalletConnectors, CoinbaseWalletConnectors],
				initialAuthenticationMode: simpleLayout ? 'connect-only' : 'connect-and-sign'
			}}
		>
			<DynamicWagmiConnector>
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
			</DynamicWagmiConnector>
		</DynamicContextProvider>
	);
};

export default App;
