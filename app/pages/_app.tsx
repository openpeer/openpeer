import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';
import 'tailwindcss/tailwind.css';

import Head from 'app/head';
import Layout from 'components/layout';
import NoAuthLayout from 'components/NoAuthLayout';
import merge from 'lodash.merge';
import { devChains, productionChains } from 'models/networks';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { Manrope } from '@next/font/google';
import { connectorsForWallets, lightTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit';
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';
import {
	argentWallet,
	braveWallet,
	coinbaseWallet,
	injectedWallet,
	ledgerWallet,
	metaMaskWallet,
	rainbowWallet,
	trustWallet,
	walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!;

const enabledChains = process.env.NODE_ENV === 'development' ? devChains : productionChains;

const { chains, provider } = configureChains(enabledChains, [
	alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_API_KEY! }),
	alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_MUMBAI_API_KEY! }),
	publicProvider()
]);

const connectors = connectorsForWallets([
	{
		groupName: 'Recommended',
		wallets: [
			// minkeWallet({ chains, projectId, name: 'Minke' }),
			metaMaskWallet({ chains, projectId }),
			rainbowWallet({ chains, projectId }),
			braveWallet({ chains }),
			argentWallet({ chains, projectId }),
			trustWallet({ chains, projectId })
		]
	},
	{
		groupName: 'Others',
		wallets: [
			walletConnectWallet({ chains, projectId }),
			ledgerWallet({ chains, projectId }),
			coinbaseWallet({ appName: 'OpenPeer', chains }),
			injectedWallet({ chains })
		]
	}
]);

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider
});

const manrope = Manrope({
	subsets: ['latin'],
	variable: '--font-manrope'
});

const myTheme = merge(lightTheme(), {
	fonts: {
		body: manrope.style.fontFamily
	}
}) as Theme;

const App = ({ Component, pageProps }: AppProps) => {
	const { disableAuthentication } = pageProps;
	return (
		<WagmiConfig client={wagmiClient}>
			{disableAuthentication ? (
				<RainbowKitProvider showRecentTransactions chains={chains} theme={myTheme}>
					<Head />
					{/* @ts-ignore */}
					<NoAuthLayout pageProps={pageProps} Component={Component} />
				</RainbowKitProvider>
			) : (
				<SessionProvider refetchInterval={0} session={pageProps.session}>
					<RainbowKitSiweNextAuthProvider>
						<RainbowKitProvider showRecentTransactions chains={chains} theme={myTheme}>
							<Head />
							{/* @ts-ignore */}
							<Layout pageProps={pageProps} Component={Component} />
						</RainbowKitProvider>
					</RainbowKitSiweNextAuthProvider>
				</SessionProvider>
			)}
		</WagmiConfig>
	);
};

export default App;
