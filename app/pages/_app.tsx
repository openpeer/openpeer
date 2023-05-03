import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';
import 'tailwindcss/tailwind.css';

import Head from 'app/head';
import Layout from 'components/layout';
import NoAuthLayout from 'components/NoAuthLayout';
import WidgetLayout from 'components/WidgetLayout';
import merge from 'lodash.merge';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { createClient, WagmiConfig } from 'wagmi';

import { Manrope } from '@next/font/google';
import {
	connectorsForWallets, lightTheme, RainbowKitProvider, Theme
} from '@rainbow-me/rainbowkit';
import {
	GetSiweMessageOptions, RainbowKitSiweNextAuthProvider
} from '@rainbow-me/rainbowkit-siwe-next-auth';
import {
	argentWallet, braveWallet, coinbaseWallet, injectedWallet, ledgerWallet, metaMaskWallet,
	rainbowWallet, trustWallet, walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets';

import { chains, provider } from '../models/chains';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!;

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
	statement: 'Sign in to the OpenPeer app'
});

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
	const { disableAuthentication, widget } = pageProps;
	return (
		<WagmiConfig client={wagmiClient}>
			{disableAuthentication ? (
				<RainbowKitProvider chains={chains} theme={myTheme}>
					<Head />
					{/* @ts-ignore */}
					<NoAuthLayout pageProps={pageProps} Component={Component} />
				</RainbowKitProvider>
			) : widget ? (
				<SessionProvider refetchInterval={0} session={pageProps.session}>
					<RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
						<RainbowKitProvider chains={chains} theme={myTheme}>
							<Head />
							{/* @ts-ignore */}
							<WidgetLayout pageProps={pageProps} Component={Component} />
						</RainbowKitProvider>
					</RainbowKitSiweNextAuthProvider>
				</SessionProvider>
			) : (
				<SessionProvider refetchInterval={0} session={pageProps.session}>
					<RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
						<RainbowKitProvider chains={chains} theme={myTheme}>
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
