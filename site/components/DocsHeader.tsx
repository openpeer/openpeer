'use client';
import { useState } from 'react';
import Image from 'next/image';
import logo from '../public/logo-dark.svg';
import twitterLogo from '../public/twitter-dark.svg';

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
						<a className="hover:underline" href="disclamer.html">
							Disclamer
						</a>
						<a className="hover:underline" href="faq.html">
							Terms
						</a>
						<a className="hover:underline" href="privacy-policy.html">
							Privacy Policy
						</a>
						<a
							href="https://twitter.com/openpeer_xyz"
							target="_blank"
							rel="noreferrer"
							className="px-2 mt-1"
						>
							<Image src={twitterLogo} alt="openpeer logo" width={20} height={20} />
						</a>
					</div>
				</div>
			</nav>

			<div className={`navbar-menu ${navbar ? '' : 'hidden'}`}>
				<div className="flex flex-column items-center space-x-8 text-xl">
					<ul className="text-center flex-1">
						<li className="hidden">
							<a href="faq.html">FAQ</a>
						</li>
						<li className="hidden">
							<a href="docs.html">Docs</a>
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
										alt="openpeer logo"
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
