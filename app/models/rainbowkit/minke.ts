import { Chain, Wallet } from '@rainbow-me/rainbowkit';
import { InjectedConnector, InjectedConnectorOptions } from '@wagmi/core';

export interface MyWalletOptions {
	projectId: string;
	chains: Chain[];
}

export const minkeWallet = ({ chains, ...options }: MyWalletOptions & InjectedConnectorOptions): Wallet => ({
	id: 'minke',
	name: 'Minke',
	iconUrl: 'https://avatars2.githubusercontent.com/u/90388553?s=200&v=4',
	iconBackground: '#F3D2BB',
	downloadUrls: {
		android: 'https://my-wallet/android',
		ios: 'https://my-wallet/ios',
		qrCode: 'https://my-wallet/qr'
	},
	createConnector: () => {
		const connector = new InjectedConnector({
			chains,
			options
		});

		return {
			connector,
			mobile: {
				getUri: undefined
			},
			qrCode: undefined
		};
	}
});
