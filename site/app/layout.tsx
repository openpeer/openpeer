import './globals.css';

import Image from 'next/image';

import logo from '../public/logo.svg';
import twitterLogo from '../public/twitter.svg';
import discord from '../public/discord.svg';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head />
			<body>
				<div className="container mx-auto px-4">{children}</div>
				{/* Footer */}
				<div className="bg-black text-white">
					<div className="container mx-auto p-16 flex flex-col justify-center md:flex-row md:justify-between">
						<div className="flex flex-col items-center md:items-start">
							<a className="text-3xl font-bold leading-none" href="#">
								<Image src={logo} alt="openpeer logo" width={160} height={51} />
							</a>
							<p className="w-80 mt-8 text-center md:text-left">
								OpenPeer is a decentralized P2P exchange protocol.
							</p>
						</div>
						<div className="flex flex-col space-y-4 md:space-y-0 text-center md:flex-row mt-8 items-center md:mt-0 md:self-start justify-center md:justify-start">
							<a href="/disclamer" className="px-2 hover:underline">
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
							<a href="/terms" className="px-2 hover:underline">
								Terms
							</a>
							<a href="/privacy-policy" className="px-2 hover:underline">
								Privacy Policy
							</a>
							<a
								href="https://twitter.com/openpeer_xyz"
								target="_blank"
								rel="noreferrer"
								className="px-2 m-auto"
							>
								<Image src={twitterLogo} alt="openpeer logo" width={18} height={18} />
							</a>
							<a
								href="https://discord.gg/Wrf9BT8sZN"
								target="_blank"
								rel="noreferrer"
								className="px-2 m-auto"
							>
								<Image src={discord} alt="openpeer logo" width={18} height={18} />
							</a>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
