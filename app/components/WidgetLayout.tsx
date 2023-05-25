import type { AppProps } from 'next/app';

import 'react-toastify/dist/ReactToastify.css';

import { chains } from 'models/chains';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import darkLogo from 'public/smallDarkLogo.svg';
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { isBrowser, smallWalletAddress } from 'utils';
import { useAccount } from 'wagmi';

import { Manrope } from '@next/font/google';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { InjectedConnector } from '@wagmi/core';

import Button from './Button/Button';

const manrope = Manrope({
	subsets: ['latin'],
	variable: '--font-manrope'
});

const WidgetLayout = ({ Component, pageProps }: AppProps) => {
	const [props, setProps] = useState<AppProps['pageProps']>({});
	const { isConnected, address } = useAccount();
	// @ts-expect-error
	const minkeWallet = isBrowser() && window.ethereum?.isMinkeWallet;
	// @ts-expect-error
	const chainId = minkeWallet ? window.ethereum.chainId : undefined;
	const { data: session, status } = useSession();
	const { openConnectModal } = useConnectModal();

	const connector = new InjectedConnector({
		chains
	});

	useEffect(() => {
		const { widget, ...rest } = pageProps;
		const { tokenAmount, fiatAmount, token, currency } = rest;

		if (widget && (tokenAmount || fiatAmount) && token && currency) {
			setProps(rest);
		}
	}, [pageProps]);

	// @ts-expect-error
	const connectedAddress = session?.address as `0x${string}` | undefined;
	useEffect(() => {
		const startConnection = async () => {
			if (minkeWallet && chainId) {
				if (isConnected) {
					if (connectedAddress && address !== connectedAddress) {
						await signOut();
					}
				} else {
					await connector.connect({ chainId: Number(chainId) });
				}
			}
		};

		startConnection();
	}, [minkeWallet, chainId, isConnected, connectedAddress]);

	const { currency, token, ...rest } = props;

	if (status === 'unauthenticated') {
		return (
			<div className="flex mb-2 h-screen">
				<div className="flex-row m-auto flex justify-center justify-items-center content-center text-center">
					<Button title="Connect Wallet" onClick={openConnectModal} />
					<div className="hidden">
						<Component {...pageProps} />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={`${manrope.variable} font-sans h-screen bg-slate-50`}>
			<nav>
				<div className="mx-auto sm:px-6 lg:px-8 ml-4">
					<div className="flex h-16 justify-between items-center">
						<div className="flex flex-row items-center space-x-2">
							<div className="flex">
								<div className="flex flex-shrink-0 items-center">
									<Link href={`/widget/${currency}/${token}?${new URLSearchParams(rest).toString()}`}>
										<Image
											src={darkLogo}
											alt="openpeer logo"
											className="h-8 w-auto"
											width={104}
											height={23}
										/>
									</Link>
								</div>
							</div>
						</div>
						{isConnected && (
							<div className="sm:ml-6 sm:flex pr-4 sm:items-center">
								<div className="relative ml-3">
									<p className="text-lg font-semibold">{smallWalletAddress(address!)}</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</nav>
			<Component {...pageProps} />
			<ToastContainer />
		</div>
	);
};

export default WidgetLayout;
