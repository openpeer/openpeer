import React from 'react';
import Image from 'next/image';
import openpeedrAirdrop from 'public/airdrop/openpeedrAirdrop.svg';
import bgTopRight from 'public/airdrop/bgAirdropTopRight.png';
import bgBottomLeft from 'public/airdrop/bgAirdropBottomLeft.png';

const AirdropPage = () => {
	return (
		<>
			<div className="absolute top-0 right-0 -z-40">
				<Image src={bgTopRight} alt={''} />
			</div>
			<div className="p-6 md:mt-8 md:px-16 flex flex-col md:flex-row md:space-x-16 text-zinc-800 relative text-center md:text-left">
				<div className="w-full md:w-1/2 flex flex-col">
					<span className="font-extrabold text-4xl md:text-5xl">Trade on OpenPeer</span>
					<span className="font-extrabold text-transparent text-4xl md:text-5xl mb-4 bg-clip-text bg-gradient-to-r from-[#9B69F6] via-[#3CB5C9] to-[#3CB5C9]">
						receive rewards
					</span>
					<span className="text-base text-zinc-800">
						We’re running a retroactive airdrop campaign with a monthly rewards pool. If you trade on
						OpenPeer, you will be rewarded based on your volume and providing liquidity to the protocol.
						<a href="#" className="underline hover:no-underline">
							Read about details here
						</a>
						.
					</span>
				</div>
				<div className="w-full mt-8 md:mt-0 md:w-1/2 rounded-xl mx-auto p-[4px] bg-gradient-to-r from-[#3C9AAA] to-[#2A4BE3]">
					<div className="flex flex-col justify-center items-center p-4 md:p-0 h-full bg-white text-white rounded-lg text-gray-800">
						<div className="mb-4 font-light text-zinc-500 md:text-xl">Time until the next airdrop</div>
						<div className="flex flex-row space-x-2 md:space-x-8">
							<div className="flex items-center space-x-2">
								<span className="text-2xl md:text-3xl font-bold">05</span>
								<span className="font-light">day</span>
							</div>
							<div className="flex items-center space-x-2">
								<span className="text-2xl md:text-3xl font-bold">07</span>
								<span className="font-light">hour</span>
							</div>
							<div className="flex items-center space-x-2">
								<span className="text-2xl md:text-3xl font-bold">03</span>
								<span className="font-light">min</span>
							</div>
							<div className="flex items-center space-x-2">
								<span className="text-2xl md:text-3xl font-bold">56</span>
								<span className="font-light">sec</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="p-4 md:px-16 mt-4 flex flex-col text-[#25385A]">
				<div className="w-full flex justify-between">
					<div className="flex fle	x-row items-center space-x-2">
						<span>
							<Image src={openpeedrAirdrop} alt="Airdrop OpenPeer" className="" />
						</span>
						<span className="text-lg">Monthly airdrop</span>
					</div>
					<span>
						<a
							href=""
							className="border border-cyan-600 px-8 py-2 rounded-full text-cyan-600 hover:bg-cyan-800 hover:text-white transition ease-in-out hover:-translate-y-1 duration-200"
						>
							Share it
						</a>
					</span>
				</div>
				<div className="mt-4 w-full rounded-xl p-[4px] bg-gradient-to-r from-[#3C9AAA] to-[#2A4BE3]">
					<div className="flex flex-col p-8 justify-center items-center h-full bg-white text-white rounded-lg text-gray-800">
						<div className="flex flex-col md:flex-row md:space-x-20 items-center">
							<div>
								<div className="flex flex-col mb-4">
									<span>0 / 38493.81 USD</span>
									<span className="text-[#25385A] font-bold">Eligible buy volume</span>
									<span className="text-[#67738E] font-light">
										Crypto purchases between new verified users.
									</span>
								</div>
								<div className="flex flex-col mb-4">
									<span className="text-[#25385A] font-bold">What will be airdropped?</span>
									<span className="text-[#67738E] font-light">
										You will be rewarded with vP2P tokens based on your trade volume. This token
										will be convertible to our protocol's upcoming P2P token.
									</span>
								</div>
							</div>
							<div>
								<div className="flex flex-col mb-4">
									<span>0 / 21331.09 USD</span>
									<span className="text-[#25385A] font-bold">Eligible sell volume</span>
									<span className="text-[#67738E] font-light">
										Crypto sales between new verified users.
									</span>
								</div>
								<div className="flex flex-col mb-4">
									<span className="text-[#25385A] font-bold">How to collect your reward?</span>
									<span className="text-[#67738E] font-light">
										After the countdown hits zero and this month's epoch ends, the calculated reward
										will be airdropped to your eligible wallet by the team.
									</span>
								</div>
							</div>
							<div className="flex justify-center items-center text-center">
								<div className="rounded-full mt-6 md:mt-0 p-[4px] bg-gradient-to-r from-[#6FD9EC] to-[#6BA4F8]">
									<div className="flex flex-col w-[200px] h-[200px] md:w-[220px] md:h-[220px] p-10 justify-center items-center text-white bg-gradient-to-r from-[#2C76E5] to-[#6FD9EC] rounded-full p-8 text-gray-800">
										<span className="text-white text-base mb-2">Elegible for</span>
										<span className="text-white text-5xl font-bold mb-2">0</span>
										<span className="text-white text-2xl">vP2P</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="p-8 m-auto text-sm text-gray-400">OpenPeer 2023</div>
				<div className="absolute bottom-40 left-0 -z-40">
					<Image src={bgBottomLeft} alt={''} />
				</div>
			</div>
		</>
	);
};

export async function getServerSideProps() {
	return {
		props: { title: 'Airdrop' } // will be passed to the page component as props
	};
}
export default AirdropPage;
