'use client';
import { useState } from 'react';
import Image from 'next/image';
import logo from '../public/logo-dark.svg';
import twitterLogo from '../public/twitter-dark.svg';
import discord from '../public/discord-dark.svg';

const DocsHeader = () => {
	const [navbar, setNavbar] = useState(false);
	return (
		<div className="mt-8">
			<nav className="w-full flex items-center justify-between mt-10 relative">
				<a className="text-3xl font-bold leading-none" href="/">
					<Image src={logo} alt="openpeer logo" width={200} height={51} />
				</a>
				<div className="sm:hidden" onClick={() => setNavbar(!navbar)}>
					<button className="navbar-burger flex items-center p-3">
						<svg
							className="block h-4 w-4 fill-current"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Mobile menu</title>
							<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
						</svg>
					</button>
				</div>

				<div className="hidden sm:block">
					<div className="flex flex-row items-center justify-between space-x-8 text-sm">
						<a className="hover:underline" href="disclamer">
							Disclamer
						</a>
						<a
							href="https://docs.openpeer.xyz"
							target="_blank"
							rel="noreferrer"
							className="px-2 hover:underline"
						>
							Docs
						</a>
						<a className="hover:underline" href="terms">
							Terms
						</a>
						<a className="hover:underline" href="privacy-policy">
							Privacy Policy
						</a>
						<a
							href="https://twitter.com/openpeer_xyz"
							target="_blank"
							rel="noreferrer"
							className="mt-1 hover:opacity-50"
						>
							<Image src={twitterLogo} alt="openpeer logo" width={20} height={20} />
						</a>
						<a
							href="https://discord.gg/Wrf9BT8sZN"
							target="_blank"
							rel="noreferrer"
							className="mt-1 hover:opacity-50"
						>
							<Image src={discord} alt="openpeer logo" width={20} height={20} />
						</a>
					</div>
				</div>
			</nav>

			<div className={`navbar-menu ${navbar ? '' : 'hidden'}`}>
				<div className="flex flex-column items-center justify-center text-default bg-gray-100 mt-4 rounded-lg">
					<ul className="text-center flex-1 p-8">
						<li className="mb-4">
							<a className="hover:underline" href="disclamer">
								Disclamer
							</a>
						</li>
						<li className="mb-4">
							<a className="hover:underline" href="terms">
								Terms
							</a>
						</li>
						<li className="mb-4">
							<a className="hover:underline" href="privacy-policy">
								Privacy Policy
							</a>
						</li>
						<li>
							<a
								href="https://twitter.com/openpeer_xyz"
								target="_blank"
								rel="noreferrer"
								className="px-2"
							>
								<div className="hover:opacity-50">
									<Image
										src={twitterLogo}
										alt="Twitter"
										width={20}
										height={20}
										className="inline-block"
									/>
								</div>
							</a>
						</li>
						<li>
							<a href="https://discord.gg/Wrf9BT8sZN" target="_blank" rel="noreferrer" className="px-2">
								<div className="hover:opacity-50">
									<Image
										src={discord}
										alt="Discord"
										width={20}
										height={20}
										className="inline-block"
									/>
								</div>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default DocsHeader;
