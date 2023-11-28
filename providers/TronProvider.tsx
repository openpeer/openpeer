/* eslint-disable react/jsx-no-bind */
import React, { useMemo } from 'react';
import '@tronweb3/tronwallet-adapter-react-ui/style.css';
import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletModalProvider } from '@tronweb3/tronwallet-adapter-react-ui';
import { WalletDisconnectedError, WalletError, WalletNotFoundError } from '@tronweb3/tronwallet-abstract-adapter';
import { toast } from 'react-toastify';
import {
	BitKeepAdapter,
	LedgerAdapter,
	OkxWalletAdapter,
	TokenPocketAdapter,
	TronLinkAdapter,
	WalletConnectAdapter
} from '@tronweb3/tronwallet-adapters';
import { TronAuthenticationProvider } from 'contexts/TronAuthenticationContext';

const TronProvider = ({ children }: { children: React.ReactNode }) => {
	function onError(e: WalletError) {
		if (e instanceof WalletNotFoundError) {
			toast.error(e.message);
		} else if (e instanceof WalletDisconnectedError) {
			toast.error(e.message);
		} else toast.error(e.message);
	}
	const adapters = useMemo(() => {
		const tronLinkAdapter = new TronLinkAdapter();
		const ledger = new LedgerAdapter();
		const walletConnectAdapter = new WalletConnectAdapter({
			network: 'Mainnet',
			options: {
				relayUrl: 'wss://relay.walletconnect.com',
				projectId: '5fc507d8fc7ae913fff0b8071c7df231',
				metadata: {
					name: 'OpenPeer',
					description: 'Self-Custody P2P Crypto Trading',
					url: 'https://app.openpeer.xyz/',
					icons: ['https://openpeerpublic.s3.us-west-1.amazonaws.com/logo/oplogo.png']
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
				<TronAuthenticationProvider>{children}</TronAuthenticationProvider>
			</WalletModalProvider>
		</WalletProvider>
	);
};

export default TronProvider;
