'use client';
import './background.css';

import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

import heroImage from '../public/hero-image.png';
import keysImage from '../public/illustrations/keys.png';
import ButtonAnimated from '../components/Button/ButtonAnimated';
import NavigationSite from '../components/Navigation';
import Partners from '../components/Partners';

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
			<p className="font-normal text-base md:text-sm mb-4">{description}</p>
			<Link href={''}>
				<ButtonAnimated smallButton title={cta} />
			</Link>
		</div>
	);
};

export default function Home() {
	return (
		<>
			<Image src={heroImage} alt={''} className="absolute object-fill left-0 top-8 md:-top-48 mx-auto -z-50" />
			<div>
				<NavigationSite />
				<div className="mt-24 sm:mt-24 mb-24">
					<div className="text-center text-5xl sm:text-6xl mb-8">
						<div className="font-semibold">
							<h1 className="text-4xl lg:text-7xl font-bold">
								Decentralised P2P <br className="hidden md:block" /> Exchange
							</h1>
						</div>
					</div>
					<div className="font-normal">
						<div className="flex flex-row text-center justify-center space-x-4 text-2xl mb-8">
							Buy crypto directly to your wallet from your <br className="hidden md:block" /> bank account
							with zero-fees.
						</div>
					</div>
					<div className="text-center mt-0 md:mt-16">
						<Link href="https://app.openpeer.xyz" target="_blank">
							<ButtonAnimated title="LAUNCH APP" />
						</Link>
					</div>
				</div>

				<div className="my-24 md:mt-32 md:mb-24 mx-2 lg:mx-8">
					<div className="w-full flex flex-col flex-col-reverse md:flex-row border border-white/10 rounded-2xl p-6 md:py-24 md:px-16 relative bg-gradient-to-r from-[#142228] via-[#142228]  backdrop-blur-xl">
						<div className="w-full md:w-1/2">
							<h3 className="text-[#7AB0B5] text-5xl font-bold mb-8">Your Keys, Your Coins</h3>
							<p className="text-[#DBDBDB] text-base">
								Only you control your crypto. Buy and sell crypto with fiat directly from your
								self-custody wallet like Metamsk. No need to hold your funds on an exchange.
							</p>
						</div>
						<div className="w-full md:w-1/2">
							<div className="relative md:absolute -top-10 right-0">
								<Image src={keysImage} alt={''} />
							</div>
						</div>
					</div>
				</div>

				<div className="my-24 md:my-24 mx-2 lg:mx-8">
					<div className="w-full flex flex-col md:flex-row border border-white/10 rounded-2xl p-6 md:py-24 md:px-16 relative bg-gradient-to-r from-[#142228] via-[#142228]  backdrop-blur-xl">
						<div className="w-full md:w-1/2">
							<div className="relative md:absolute -top-10 left-0">
								<Image src={keysImage} alt={''} />
							</div>
						</div>
						<div className="w-full md:w-1/2">
							<h3 className="text-[#7AB0B5] text-5xl font-bold mb-8">Global Availability</h3>
							<p className="text-[#DBDBDB] text-base">
								Trade with anyone anywhere with any currency and payment method. OpenPeer is an open
								protocol on Ethereum & other EVM-compatible networks
							</p>
						</div>
					</div>
				</div>

				<div className="my-24 md:my-24 mx-2 lg:mx-8">
					<div className="w-full flex flex-col flex-col-reverse md:flex-row border border-white/10 rounded-2xl p-6 md:py-24 md:px-16 relative bg-gradient-to-r from-[#142228] via-[#142228]  backdrop-blur-xl">
						<div className="w-full md:w-1/2">
							<h3 className="text-[#7AB0B5] text-5xl font-bold mb-8">Multichain Settlement</h3>
							<p className="text-[#DBDBDB] text-base">
								Trade between fiat and crypto on multiple EVM chains including Ethereum, Polygon,
								Binance Smart Chain and Optimism. Get funds directly in your wallet on the chain of your
								choice.
							</p>
						</div>
						<div className="w-full md:w-1/2">
							<div className="relative md:absolute -top-10 right-0">
								<Image src={keysImage} alt={''} />
							</div>
						</div>
					</div>
				</div>

				<Partners />

				<div className="flex flex-col justify-around mx-2 md:mx-8 md:space-x-8 md:flex-row mb-24">
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
			</div>
		</>
	);
}
