/* eslint-disable react/jsx-no-bind */
import React, { useMemo } from 'react';
import '@tronweb3/tronwallet-adapter-react-ui/style.css';
import { WalletProvider, useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletActionButton, WalletModalProvider } from '@tronweb3/tronwallet-adapter-react-ui';
import { AppProps } from 'next/app';
import { WalletDisconnectedError, WalletError, WalletNotFoundError } from '@tronweb3/tronwallet-abstract-adapter';
import { ToastContainer, toast } from 'react-toastify';
import {
	BitKeepAdapter,
	LedgerAdapter,
	OkxWalletAdapter,
	TokenPocketAdapter,
	TronLinkAdapter,
	WalletConnectAdapter
} from '@tronweb3/tronwallet-adapters';

function ConnectComponent() {
	return <WalletActionButton />;
}

function Profile() {
	const { address, connected, wallet } = useWallet();
	return (
		<div>
			<p>
				<span>Connection Status:</span> {connected ? 'Connected' : 'Disconnected'}
			</p>
			<p>
				<span>Your selected Wallet:</span> {wallet?.adapter.name}
			</p>
			<p>
				<span>Your Address:</span> {address}
			</p>
		</div>
	);
}

const TronLayout = ({ Component, pageProps }: AppProps) => {
	function onError(e: WalletError) {
		if (e instanceof WalletNotFoundError) {
			toast.error(e.message);
		} else if (e instanceof WalletDisconnectedError) {
			toast.error(e.message);
		} else toast.error(e.message);
	}
	const adapters = useMemo(() => {
		const tronLinkAdapter = new TronLinkAdapter();
		const ledger = new LedgerAdapter({
			accountNumber: 2
		});
		const walletConnectAdapter = new WalletConnectAdapter({
			network: 'Mainnet',
			options: {
				relayUrl: 'wss://relay.walletconnect.com',
				// example WC app project ID
				projectId: '5fc507d8fc7ae913fff0b8071c7df231',
				metadata: {
					name: 'Test DApp',
					description: 'JustLend WalletConnect',
					url: 'https://your-dapp-url.org/',
					icons: ['https://your-dapp-url.org/mainLogo.svg']
				}
			},
			web3ModalConfig: {
				themeMode: 'dark',
				themeVariables: {
					'--w3m-z-index': '1000'
				}
			}
		});
		const bitKeepAdapter = new BitKeepAdapter();
		const tokenPocketAdapter = new TokenPocketAdapter();
		const okxwalletAdapter = new OkxWalletAdapter();
		return [tronLinkAdapter, bitKeepAdapter, tokenPocketAdapter, okxwalletAdapter, walletConnectAdapter, ledger];
	}, []);

	return (
		<WalletProvider onError={onError} adapters={adapters}>
			<WalletModalProvider>
				<ConnectComponent />
				<Profile />
				<Component {...pageProps} />
				<ToastContainer />
			</WalletModalProvider>
		</WalletProvider>
	);
};

export default TronLayout;
