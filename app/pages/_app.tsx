import type { AppProps } from 'next/app';
import 'tailwindcss/tailwind.css';

import Head from 'app/head';
import CustomAvatar from 'components/CustomAvatar';
import Layout from 'components/layout';
import NoAuthLayout from 'components/NoAuthLayout';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { devChains, productionChains } from 'models/networks';
import React from 'react';
import { siweClient } from 'utils/siweClient';
import { createConfig, WagmiConfig } from 'wagmi';

import { Manrope } from '@next/font/google';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!;

const enabledChains = process.env.NODE_ENV === 'development' ? devChains : productionChains;

const manrope = Manrope({
	subsets: ['latin'],
	variable: '--font-manrope'
});
const config = createConfig(
	getDefaultConfig({
		chains: enabledChains,
		// Required API Keys
		alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_API_KEY,
		walletConnectProjectId: projectId,

		// Required
		appName: 'OpenPeer',

		// Optional
		appDescription: 'Self-Custody P2P Crypto Trading',
		appUrl: 'https://openpeer.xyz', // your app's url
		appIcon: 'https://app.openpeer.xyz/favicon.png' // your app's icon, no bigger than 1024x1024px (max. 1MB)
	})
);

const App = ({ Component, pageProps }: AppProps) => {
	const { disableAuthentication } = pageProps;
	return (
		<WagmiConfig config={config}>
			<siweClient.Provider signOutOnNetworkChange={false} enabled={!disableAuthentication}>
				<ConnectKitProvider
					customTheme={{
						'--ck-font-family': manrope.style.fontFamily,
						'--ck-font-weight': manrope.style.fontWeight,
						'--ck-accent-color': '#0891b2',
						'--ck-accent-text-color': '#f8fafc'
					}}
					options={{
						customAvatar: CustomAvatar,
						embedGoogleFonts: true
					}}
				>
					<Head />
					{disableAuthentication ? (
						// @ts-expect-error
						<NoAuthLayout pageProps={pageProps} Component={Component} />
					) : (
						// @ts-expect-error
						<Layout pageProps={pageProps} Component={Component} />
					)}
				</ConnectKitProvider>
			</siweClient.Provider>
		</WagmiConfig>
	);
};

export default App;
