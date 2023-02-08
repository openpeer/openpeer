import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';
import 'tailwindcss/tailwind.css';

import Head from 'app/head';
import Layout from 'components/layout';
import merge from 'lodash.merge';
import { SessionProvider } from 'next-auth/react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { polygon, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import { Manrope } from '@next/font/google';
import { getDefaultWallets, lightTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit';
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';

// @TODO: ALCHEMY PROVIDER
const { chains, provider } = configureChains([polygon, polygonMumbai], [publicProvider()]);

const { connectors } = getDefaultWallets({
	appName: 'OpenPeer',
	chains
});

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
	return (
		<WagmiConfig client={wagmiClient}>
			<SessionProvider refetchInterval={0} session={pageProps.session}>
				<RainbowKitSiweNextAuthProvider>
					<RainbowKitProvider chains={chains} theme={myTheme}>
						<Head />
						{/* @ts-ignore */}
						<Layout pageProps={pageProps} Component={Component} />
					</RainbowKitProvider>
				</RainbowKitSiweNextAuthProvider>
			</SessionProvider>
		</WagmiConfig>
	);
};

export default App;
