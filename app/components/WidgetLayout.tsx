import type { AppProps } from 'next/app';

import 'react-toastify/dist/ReactToastify.css';

import { chains } from 'models/chains';
import Image from 'next/image';
import Link from 'next/link';
import darkLogo from 'public/logo-dark.svg';
import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { smallWalletAddress } from 'utils';
import { useAccount } from 'wagmi';

import { Manrope } from '@next/font/google';
import { InjectedConnector } from '@wagmi/core';

const manrope = Manrope({
	subsets: ['latin'],
	variable: '--font-manrope'
});

const isBrowser = () => typeof window !== 'undefined';

const WidgetLayout = ({ Component, pageProps }: AppProps) => {
	const { isConnected, address } = useAccount();
	// @ts-expect-error
	const minkeWallet = isBrowser() && window.ethereum?.isMinkeWallet;
	// @ts-expect-error
	const chainId = minkeWallet ? window.ethereum.chainId : undefined;

	useEffect(() => {
		const startConnection = async () => {
			if (minkeWallet && chainId && !isConnected) {
				const connector = new InjectedConnector({
					chains
				});
				await connector.connect({ chainId: Number(chainId) });
			}
		};

		startConnection();
	}, [minkeWallet, chainId, isConnected]);

	return (
		<div className={`${manrope.variable} font-sans h-screen bg-slate-50`}>
			<nav>
				<div className="mx-auto sm:px-6 lg:px-8 ml-4">
					<div className="flex h-16 justify-between items-center">
						<div className="flex flex-row items-center space-x-2">
							<div className="flex">
								<div className="flex flex-shrink-0 items-center">
									<Link href="/">
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
								<div className="relative ml-3">{smallWalletAddress(address!)}</div>
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
