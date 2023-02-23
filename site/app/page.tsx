'use client';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import lock from '../public/lock.png';
import logo from '../public/logo.svg';
import outlierVentures from '../public/outlier-ventures.png';
import passport from '../public/passport.png';
import people from '../public/people.png';
import polygonLogoWhite from '../public/polygon-logo-white.png';
import twitterLogo from '../public/twitter.svg';

interface FeatureParams {
	title: string;
	description: string;
	image: StaticImageData;
}

const Feature = ({ title, description, image }: FeatureParams) => {
	return (
		<div className="flex flex-col items-center mb-12">
			<Image src={image} alt={title} width={150} className="mb-4" />
			<h3 className="text-2xl mb-4 text-center">{title}</h3>
			<div className="font-normal">
				<p className="text-center text-base">{description}</p>
			</div>
		</div>
	);
};

export default function Home() {
	const [navbar, setNavbar] = useState(false);

	return (
		<>
			<div>
				<nav className="mt-10 relative flex justify-between w-full">
					<a className="text-3xl font-bold leading-none" href="#">
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

					<div className="flex flex-row justify-between space-x-8 text-xl hidden sm:block">
						<a className="hidden" href="faq.html">
							FAQ
						</a>
						<a className="hidden" href="docs.html">
							Docs
						</a>
						<a href="https://twitter.com/openpeer_xyz" target="_blank" rel="noreferrer" className="px-2">
							<Image src={twitterLogo} alt="openpeer logo" width={20} height={20} />
						</a>
					</div>
				</nav>

				<div className={`navbar-menu ${navbar ? '' : 'hidden'}`}>
					<div className="flex flex-column space-x-8 text-xl">
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
									<div>
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

				<div className="mt-24 sm:mt-24 mb-24">
					<div className="text-center text-5xl sm:text-6xl mb-8">
						<div className="font-semibold">
							<h1>Self-Custodial P2P Exchange</h1>
						</div>
					</div>
					<div className="font-normal">
						<div className="flex flex-row text-center justify-center space-x-4 text-2xl mb-12">
							Buy crypto directly to your wallet from your bank account with zero-fees
						</div>
					</div>
					<div className="text-center mt-24">
						<Link
							href="https://forms.gle/GAVzdT8kK4CWpZXUA"
							target="_blank"
							className="bg-[#222222] px-20 py-4 rounded-lg font-bold"
						>
							Sign up for the waitlist
						</Link>
					</div>
				</div>
				<div className="flex flex-col justify-around mx-20 md:space-x-20 md:flex-row mb-24">
					{[
						{
							title: 'Self-Custodial',
							description:
								'Only you control your crypto. Deploy a escrow contract with your funds that can only be withdrawn by the other party upon payment.',
							image: lock
						},
						{
							title: 'Direct to Wallet',
							description:
								'Buy and sell crypto with fiat directly from your self-custody wallet like Metamask. No need to hold your funds on an exchange.',
							image: passport
						},
						{
							title: 'Global Availability',
							description:
								'Trade with anyone anywhere with any currency and payment method. OpenPeer is an open protocol on Ethereum & Polygon.',
							image: people
						}
					].map((item) => (
						<Feature key={item.title} {...item} />
					))}
				</div>
				<div className="flex flex-col text-center mb-24">
					<h3 className="text-2xl mb-12">Supported by</h3>
					<div className="flex flex-col md:flex-row items-center gap-8 m-auto">
						<Image src={outlierVentures} alt="Outlier Ventures" />
						<Image src={polygonLogoWhite} alt="Polygon" />
					</div>
				</div>
			</div>
		</>
	);
}
