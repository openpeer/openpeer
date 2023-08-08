import React from 'react';

import { useState } from 'react';

import Image from 'next/image';
import discord from '../public/discord.svg';
import logo from '../public/logo.svg';
import twitterLogo from '../public/twitter.svg';

const NavigationSite = () => {
	const [navbar, setNavbar] = useState(false);
	return (
		<nav className="rounded-lg mt-10 flex justify-between md:w-2/3 mx-auto items-center p-6 backdrop-blur-xl bg-white/20 border border-white/10">
			<a className="text-3xl font-bold leading-none" href="/">
				<Image src={logo} alt="openpeer logo" width={200} height={51} />
			</a>
			<div className="lg:hidden" onClick={() => setNavbar(!navbar)}>
				<button className="navbar-burger flex items-center p-3">
					<svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<title>Mobile menu</title>
						<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
					</svg>
				</button>
			</div>

			<div className="hidden lg:block">
				<div className="flex flex-row items-center justify-between space-x-8 text-xl">
					<a
						href="https://docs.openpeer.xyz"
						target="_blank"
						rel="noreferrer"
						className="text-base relative group"
					>
						Docs
						<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#020AD4] transition-all group-hover:w-full"></span>
					</a>
					<a
						href="https://blog.openpeer.xyz"
						target="_blank"
						rel="noreferrer"
						className="text-base relative group"
					>
						Blog
						<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#020AD4] transition-all group-hover:w-full"></span>
					</a>
					<a href="https://twitter.com/openpeer_xyz" target="_blank" rel="noreferrer">
						<Image src={twitterLogo} alt="twitter logo" width={20} height={20} />
					</a>
					<a href="https://discord.gg/Wrf9BT8sZN" target="_blank" rel="noreferrer">
						<Image src={discord} alt="discord logo" width={20} height={20} />
					</a>
				</div>
			</div>
			<div className={`navbar-menu ${navbar ? '' : 'hidden'}`}>
				<div className="flex flex-column space-x-8 text-xl">
					<ul className="text-center flex-1">
						<li className="text-center flex-1 mb-4 mt-4">
							<a href="https://docs.openpeer.xyz" target="_blank" rel="noreferrer">
								Docs
							</a>
						</li>
						<li className="text-center flex-1 mb-4">
							<a href="https://blog.openpeer.xyz" target="_blank" rel="noreferrer">
								Blog
							</a>
						</li>
						<li className="mb-4">
							<a href="https://twitter.com/openpeer_xyz" target="_blank" rel="noreferrer">
								<div>
									<Image
										src={twitterLogo}
										alt="twitter logo"
										width={20}
										height={20}
										className="inline-block"
									/>
								</div>
							</a>
						</li>
						<li className="mb-4">
							<a href="https://discord.gg/Wrf9BT8sZN" target="_blank" rel="noreferrer">
								<div>
									<Image
										src={discord}
										alt="discord logo"
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
		</nav>
	);
};

export default NavigationSite;
