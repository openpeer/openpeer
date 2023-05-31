import type { AppProps } from 'next/app';

import 'react-toastify/dist/ReactToastify.css';

import Image from 'next/image';
import Link from 'next/link';
import darkLogo from 'public/smallDarkLogo.svg';
import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import twitterLogo from '../public/twitter.svg';
import discord from '../public/discord.svg';

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
	const [isDivVisible, setIsDivVisible] = useState(false);

	const toggleDiv = () => {
		setIsDivVisible(!isDivVisible);
	};

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
								<div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8 items-center">
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
									{/* dropdown menu START */}
									<div className="relative" data-headlessui-state="open">
										<button
											className="flex items-center font-semibold hover:text-gray-900"
											id="headlessui-menu-button-1"
											type="button"
											aria-haspopup="menu"
											aria-expanded="true"
											data-headlessui-state="open"
											aria-controls="headlessui-menu-items-122"
											onClick={toggleDiv}
										>
											<span className="hidden items-center sm:flex text-gray-500">•••</span>
										</button>
										<div
											className={`absolute right-0 top-full -mr-0.5 mt-3 w-60 origin-top-right divide-y divide-gray-100 rounded-lg bg-white text-sm font-normal text-slate-900 shadow-md ring-1 ring-slate-900/5 focus:outline-none sm:-mr-3.5 transform opacity-100 scale-100 z-50 ${
												isDivVisible ? '' : 'hidden'
											}`}
											// className="absolute right-0 top-full -mr-0.5 mt-3 w-60 origin-top-right divide-y divide-gray-100 rounded-lg bg-white text-sm font-normal text-slate-900 shadow-md ring-1 ring-slate-900/5 focus:outline-none sm:-mr-3.5 transform opacity-100 scale-100 z-50"
											aria-labelledby="headlessui-menu-button-1"
											id="headlessui-menu-items-122"
											role="menu"
											data-headlessui-state="open"
										>
											<div className="py-1.5" role="none">
												<a
													className="block py-1.5 block px-3.5 py-1.5 hover:bg-slate-100 text-gray-500"
													id="headlessui-menu-item-123"
													role="menuitem"
													data-headlessui-state=""
													href="https://docs.openpeer.xyz/"
													target="_blank"
												>
													Docs
												</a>
												<a
													className="block py-1.5 block px-3.5 py-1.5 hover:bg-slate-100 text-gray-500"
													id="headlessui-menu-item-126"
													role="menuitem"
													data-headlessui-state=""
													href="https://openpeer.xyz/disclamer"
												>
													Disclamer
												</a>
												<a
													className="block py-1.5 block px-3.5 py-1.5 hover:bg-slate-100 text-gray-500"
													id="headlessui-menu-item-126"
													role="menuitem"
													data-headlessui-state=""
													href="https://openpeer.xyz/terms"
												>
													Terms
												</a>
												<a
													className="block py-1.5 block px-3.5 py-1.5 hover:bg-slate-100 text-gray-500"
													id="headlessui-menu-item-126"
													role="menuitem"
													data-headlessui-state=""
													href="https://openpeer.xyz/privacy-policy"
												>
													Privacy Policy
												</a>
											</div>
											<div className="py-1.5" role="none">
												<div className="flex flex-row py-1 px-4">
													<a
														href="https://twitter.com/openpeer_xyz"
														target="_blank"
														rel="noreferrer"
														className="px-2"
													>
														<Image
															src={twitterLogo}
															alt="openpeer logo"
															className="opacity-40 hover:opacity-90"
															width={20}
															height={20}
														/>
													</a>
													<a
														href="https://discord.gg/Wrf9BT8sZN"
														target="_blank"
														rel="noreferrer"
														className="px-2"
													>
														<Image
															src={discord}
															alt="openpeer logo"
															className="opacity-40 hover:opacity-90"
															width={21}
															height={21}
														/>
													</a>
												</div>
											</div>
										</div>
									</div>
									{/* dropdown menu end */}
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
