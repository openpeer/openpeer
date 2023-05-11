import type { AppProps } from 'next/app';

import 'react-toastify/dist/ReactToastify.css';

import Image from 'next/image';
import Link from 'next/link';
import darkLogo from 'public/smallDarkLogo.svg';
import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';

import { ChartBarSquareIcon, PlusCircleIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { Manrope } from '@next/font/google';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import { CollapseButton } from './Navigation';

const manrope = Manrope({
	subsets: ['latin'],
	variable: '--font-manrope'
});

const navigation = [
	{ name: 'Trade P2P', href: '/trade', icon: ChartBarSquareIcon },
	{ name: 'Post Ad', href: '/sell', icon: PlusCircleIcon },
	{ name: 'My Trades', href: '/orders', icon: ShoppingBagIcon }
];

const NoAuthLayout = ({ Component, pageProps }: AppProps) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { title } = pageProps;

	return (
		<div className={`${manrope.variable} font-sans h-screen bg-slate-50`}>
			<nav>
				<div className="mx-auto sm:px-6 lg:px-8">
					<div className="flex h-16 justify-between items-center">
						<div className="flex flex-row items-center space-x-2">
							<div className="sticky top-0 z-10 flex h-16 flex-shrink-0 sm:hidden">
								<CollapseButton
									open={sidebarOpen}
									onClick={() => setSidebarOpen(!sidebarOpen)}
									border={false}
								/>
							</div>
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
								<div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
									{navigation.map(({ name, href }) => (
										<Link
											href={href}
											className={`${
												title === name
													? 'border-indigo-500 text-gray-900'
													: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
											} inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium`}
											aria-current="page"
											key={name}
										>
											{name}
										</Link>
									))}
								</div>
							</div>
						</div>
						<div className="sm:ml-6 sm:flex pr-4 sm:items-center">
							<div className="relative ml-3">
								<ConnectButton
									showBalance={false}
									accountStatus={{
										smallScreen: 'avatar',
										largeScreen: 'full'
									}}
								/>
							</div>
						</div>
					</div>
				</div>
				{sidebarOpen && (
					<div className="sm:hidden" id="mobile-menu">
						<div className="space-y-1 pt-2">
							{navigation.map(({ name, href }) => (
								<Link
									href={href}
									className={`${
										title === name
											? 'text-indigo-700'
											: 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
									} block border-l-4 py-2 pl-3 pr-4 text-base font-medium`}
									aria-current="page"
									key={name}
								>
									{name}
								</Link>
							))}
						</div>
					</div>
				)}
			</nav>

			<Component {...pageProps} />
			<ToastContainer />
		</div>
	);
};

export default NoAuthLayout;
