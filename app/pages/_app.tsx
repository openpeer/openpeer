import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';
import 'tailwindcss/tailwind.css';

import Head from 'app/head';
import Layout from 'components/layout';
import NoAuthLayout from 'components/NoAuthLayout';
import WidgetLayout from 'components/WidgetLayout';
import merge from 'lodash.merge';
import { minkeWallet } from 'models/rainbowkit/minke';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { isBrowser } from 'utils';
import { createClient, WagmiConfig } from 'wagmi';

import { Manrope } from '@next/font/google';
import { connectorsForWallets, lightTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit';
import { GetSiweMessageOptions, RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';
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

import { chains, provider } from '../models/chains';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!;

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
	statement: 'Sign in to the OpenPeer app'
});

const connectors = connectorsForWallets([
	{
		groupName: 'Recommended',
		wallets: [
			minkeWallet({ chains, projectId, name: 'Minke' }),
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

const minkeConnectors = connectorsForWallets([
	{
		groupName: 'Minke',
		wallets: [minkeWallet({ chains, projectId, name: 'Minke' })]
	}
]);

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider
});

const minkeClient = createClient({
	autoConnect: true,
	connectors: minkeConnectors,
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
	// @ts-expect-error
	const isMinkeWallet = isBrowser() && window.ethereum?.isMinkeWallet;
	return (
		<WagmiConfig client={isMinkeWallet ? minkeClient : wagmiClient}>
			{disableAuthentication ? (
				<RainbowKitProvider chains={chains} theme={myTheme}>
					<Head />
					{/* @ts-expect-error */}
					<NoAuthLayout pageProps={pageProps} Component={Component} />
				</RainbowKitProvider>
			) : (
				<SessionProvider refetchInterval={0} session={pageProps.session}>
					<RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
						<RainbowKitProvider chains={chains} theme={myTheme}>
							<Head />
							{widget || isMinkeWallet ? (
								/* @ts-expect-error */
								<WidgetLayout pageProps={pageProps} Component={Component} />
							) : (
								/* @ts-expect-error */
								<Layout pageProps={pageProps} Component={Component} />
							)}
						</RainbowKitProvider>
					</RainbowKitSiweNextAuthProvider>
				</SessionProvider>
			)}
		</WagmiConfig>
	);
};

export default App;
