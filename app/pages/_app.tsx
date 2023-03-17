import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';
import 'tailwindcss/tailwind.css';

import Head from 'app/head';
import Layout from 'components/layout';
import NoAuthLayout from 'components/NoAuthLayout';
import merge from 'lodash.merge';
import { SessionProvider } from 'next-auth/react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { polygon, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { Manrope } from '@next/font/google';
import { getDefaultWallets, lightTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit';
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';

const enabledChains = process.env.NODE_ENV === 'development' ? [polygon, polygonMumbai] : [polygon];
const enabledProviders =
	process.env.NODE_ENV === 'development'
		? [
				alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_API_KEY! }),
				alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_MUMBAI_API_KEY! }),
				publicProvider()
		  ]
		: [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_API_KEY! }), publicProvider()];

const { chains, provider } = configureChains(enabledChains, enabledProviders);

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
	const { disableAuthentication } = pageProps;
	return (
		<WagmiConfig client={wagmiClient}>
			{disableAuthentication ? (
				<RainbowKitProvider chains={chains} theme={myTheme}>
					<Head />
					{/* @ts-ignore */}
					<NoAuthLayout pageProps={pageProps} Component={Component} />
				</RainbowKitProvider>
			) : (
				<SessionProvider refetchInterval={0} session={pageProps.session}>
					<RainbowKitSiweNextAuthProvider>
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
