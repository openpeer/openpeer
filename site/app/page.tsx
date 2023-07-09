'use client';
import './background.css';

import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

import HeroImage from '../public/hero-image.png';
import KeysImage from '../public/illustrations/keys.png';
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
		<div className="flex flex-col mb-12 backdrop-blur-md  border border-[#30353B] rounded-2xl p-8">
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
			<div>
				<NavigationSite />
				<div className="mt-24 sm:mt-48 mb-24">
					<div className="text-center mb-8">
						<h1 className="text-5xl lg:text-8xl font-bold shadow-md antialiased">
							Decentralised P2P Exchange
						</h1>
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

				{/* <div className="w-full lg:w-4/5 mb-40 m-auto backdrop-blur-md border border-[#30353B] rounded-2xl transform bg-gradient-to-r from-[#3C9AAA]/50 to-transparent transition-all duration-1000 hover:scale-105"> */}
				<div className="w-full lg:w-4/5 mb-16 md:mb-40 m-auto border border-[#30353B] rounded-2xl transition-all duration-1000 hover:scale-105">
					<div className="w-full flex flex-col-reverse md:flex-row p-6 md:py-24 md:px-16 relative">
						<div className="w-full md:w-1/2">
							<div className="text-[#DBDBDB] text-xl mb-4">Decentralised</div>
							<h3 className="text-5xl md:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#00D4E5] via-[#15B8DE]">
								Your Keys, Your Coins
							</h3>
							<p className="text-[#DBDBDB] text-xl">
								Only you control your crypto. Buy and sell crypto with fiat directly from your
								self-custody wallet like Metamsk. No need to hold your funds on an exchange.
							</p>
						</div>
						<div className="w-full md:w-1/2">
							<div className="relative md:absolute top-5 right-0">
								<Image src={KeysImage} alt={''} />
							</div>
						</div>
					</div>
				</div>

				<div className="w-full lg:w-4/5 mb-16 md:mb-40 m-auto backdrop-blur-md border border-[#30353B] rounded-2xl transform bg-gradient-to-l from-transparent to-transparent transition-all duration-1000 hover:scale-105 hover:bg-gradient-to-l">
					<div className="w-full flex flex-col md:flex-row p-6 md:py-24 md:px-16 relative">
						<div className="w-full md:w-1/2">
							<div className="relative md:absolute top-10 left-0">
								<Image src={''} alt={''} />
							</div>
						</div>
						<div className="w-full md:w-1/2">
							<div className="text-[#DBDBDB] text-xl mb-4">Anywhere Peer 2 Peer</div>
							<h3 className="text-5xl md:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#56d364] via-[#2ea043]">
								Global Availability
							</h3>
							<p className="text-[#DBDBDB] text-xl">
								Trade with anyone anywhere with any currency and payment method. OpenPeer is an open
								protocol on Ethereum & other EVM-compatible networks.
							</p>
						</div>
					</div>
				</div>

				<div className="w-full lg:w-4/5 mb-16 md:mb-40 m-auto backdrop-blur-md border border-[#30353B] rounded-2xl transform bg-gradient-to-l from-transparent to-transparent transition-all duration-1000 hover:scale-105 hover:bg-gradient-to-l">
					<div className="w-full flex flex-col-reverse md:flex-row p-6 md:py-24 md:px-16 relative">
						<div className="w-full md:w-1/2">
							<div className="text-[#DBDBDB] text-xl mb-4">Your choose</div>
							<h3 className="text-5xl md:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#F49F64] to-[#F56B0A]">
								Multichain Settlement
							</h3>
							<p className="text-[#DBDBDB] text-xl">
								Trade between fiat and crypto on multiple EVM chains including Ethereum, Polygon,
								Binance Smart Chain and Optimism. Get funds directly in your wallet on the chain of your
								choice.
							</p>
						</div>
						<div className="w-full md:w-1/2">
							<div className="relative md:absolute -top-4 right-0">
								<Image src={''} alt={''} />
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
