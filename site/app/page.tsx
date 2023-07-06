'use client';
import './background.css';

import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import discord from '../public/discord.svg';
import logo from '../public/logo.svg';
import twitterLogo from '../public/twitter.svg';
import outlierVentures from '../public/partners/outlierventures.png';
import polygonLogoWhite from '../public/partners/polygonlogowhite.png';
import w3iLogoWhite from '../public/partners/w3ilogowhite.png';
import bitfwdLogoWhite from '../public/partners/bitfwdlogowhite.png';
import heroImage from '../public/hero-image.png';
import keysImage from '../public/illustrations/keys.png';
import Button from '../components/Button/Button';
import ButtonAnimated from '../components/Button/ButtonAnimated';

interface FeatureParams {
	title: string;
	description: string;
	// image?: StaticImageData;
	cta: string;
}

const Feature = ({ title, description, cta }: FeatureParams) => {
	return (
		<div className="flex flex-col mb-12 border border-white rounded-2xl p-8">
			<h3 className="text-2xl mb-4">{title}</h3>
			<p className="font-normal text-sm mb-4">{description}</p>
			<Link href={''}>
				<ButtonAnimated smallButton title={cta} />
			</Link>
		</div>
	);
};

export default function Home() {
	const [navbar, setNavbar] = useState(false);

	return (
		<>
			<Image src={heroImage} alt={''} className="absolute top-0 left-0 right-0 -z-50" />
			<div>
				<nav className="rounded-lg mt-10 flex justify-between w-2/3 mx-auto items-center p-8 backdrop-blur-xl bg-white/30 border border-white/10">
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

					<div className="hidden md:block">
						<div className="flex flex-row items-center justify-between space-x-8 text-xl">
							<a href="https://docs.openpeer.xyz" target="_blank" rel="noreferrer">
								Docs
							</a>
							<a href="https://blog.openpeer.xyz" target="_blank" rel="noreferrer">
								Blog
							</a>
							<a href="https://twitter.com/openpeer_xyz" target="_blank" rel="noreferrer">
								<Image src={twitterLogo} alt="twitter logo" width={20} height={20} />
							</a>
							<a href="https://discord.gg/Wrf9BT8sZN" target="_blank" rel="noreferrer">
								<Image src={discord} alt="discord logo" width={20} height={20} />
							</a>
						</div>
					</div>
				</nav>

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

				<div className="mt-24 sm:mt-24 mb-24">
					<div className="text-center text-5xl sm:text-6xl mb-8">
						<div className="font-semibold">
							<h1>Decentralised P2P Exchange</h1>
						</div>
					</div>
					<div className="font-normal">
						<div className="flex flex-row text-center justify-center space-x-4 text-2xl mb-12">
							Buy crypto directly to your wallet from your bank account with zero-fees.
						</div>
					</div>
					<div className="text-center mt-24">
						<Link href="https://app.openpeer.xyz" target="_blank">
							<ButtonAnimated title="LAUNCH APP" />
						</Link>
					</div>
				</div>

				<div className="my-40 mx-8">
					<div className="flex flex-col flex-col-reverse md:fex-row border border-white/10 rounded-lg p-16 relative bg-gradient-to-r from-[#142228] via-[#142228]  backdrop-blur-xl">
						<div>
							<h3 className="text-[#7AB0B5] text-5xl font-bold mb-8">Your Keys, Your Coins</h3>
							<p className="text-[#DBDBDB] text-xl">
								Only you control your crypto. Buy and sell crypto with fiat directly from your
								self-custody wallet like Metamsk. No need to hold your funds on an exchange.
							</p>
						</div>
						<div className="md:w-1/2">
							<div className="relative md:absolute -top-10 right-0">
								<Image src={keysImage} alt={''} />
							</div>
						</div>
					</div>
				</div>

				<div className="flex flex-col justify-around mx-8 md:space-x-8 md:flex-row mb-24">
					{[
						{
							title: 'P2P Merchants',
							description:
								'Trade peer-to-peer with verified and high quality traders in your country. Get priority support from the OpenPeer team as you grow your trading business.',
							cta: 'Get in touch'
						},
						{
							title: 'Wallets',
							description:
								'Add OpenPeer to your self-custody wallet as a P2P fiat on/off ramp solution for your users. Quickly ntegrate our SDK and open up global markets for your business.',
							cta: 'Get in touch'
						},
						{
							title: 'Dapps & Games',
							description:
								'Onboard users into any on-chain asset both fungible or non-fungible. Users choose the asset and their fiat currency and OpenPeer will do the rest.',
							cta: 'Get in touch'
						}
					].map((item) => (
						<Feature key={item.title} {...item} />
					))}
				</div>
				<div className="flex flex-col text-center mb-24">
					<h3 className="text-4xl mb-12">Backers and Partners</h3>
					<div className="flex flex-col md:flex-row items-center gap-8 m-auto">
						<Image src={outlierVentures} alt="Outlier Ventures" />
						<Image src={polygonLogoWhite} alt="Polygon" />
						<Image src={w3iLogoWhite} alt="Polygon" />
						<Image src={bitfwdLogoWhite} alt="Polygon" />
					</div>
				</div>
			</div>
		</>
	);
}
