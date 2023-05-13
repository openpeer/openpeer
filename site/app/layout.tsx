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
					<div className="container mx-auto p-12 flex flex-col md:flex-row md:justify-between">
						<div className="flex flex-col items-center md:items-start">
							<a className="text-3xl font-bold leading-none" href="#">
								<Image src={logo} alt="openpeer logo" width={132} height={51} />
							</a>
							<p className="w-80 mt-8">OpenPeer is a decentralized P2P exchange protocol.</p>
						</div>
						<div className="flex content-center mt-8 md:mt-0 justify-center md:justify-start items-center">
							<a href="https://docs.openpeer.xyz" target="_blank" rel="noreferrer" className="px-2">
								Docs
							</a>
							<a href="" className="px-2 hidden">
								FAQ
							</a>
							<a
								href="https://twitter.com/openpeer_xyz"
								target="_blank"
								rel="noreferrer"
								className="px-2"
							>
								<Image src={twitterLogo} alt="openpeer logo" width={20} height={20} />
							</a>
							<a href="https://discord.gg/Wrf9BT8sZN" target="_blank" rel="noreferrer" className="px-2">
								<Image src={discord} alt="openpeer logo" width={20} height={20} />
							</a>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
