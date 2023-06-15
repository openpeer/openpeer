import { Airdrop } from 'models/types';
import Image from 'next/image';
import bgBottomLeft from 'public/airdrop/bgAirdropBottomLeft.png';
import bgTopRight from 'public/airdrop/bgAirdropTopRight.png';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { ConnectButton } from '@rainbow-me/rainbowkit';

const ROUND = 1;
const POOL = 500000;

const AirdropPage = () => {
	const [volume, setVolume] = useState<Airdrop>({} as Airdrop);
	const { address } = useAccount();
	useEffect(() => {
		if (!address) return;

		fetch(`/api/airdrop?address=${address}&round=${ROUND}`)
			.then((res) => res.json())
			.then((data) => {
				if (!data.message) {
					setVolume(data);
				}
			});
	}, [address]);

	const { buy_volume: buyVolume = 0, sell_volume: sellVolume = 0 } = volume;

	const total = Number(volume.total || 0);
	const usdTotal = (total || 0) * 2; // times two because buyer and seller get the same amount
	const tokens = address && total ? ((Number(buyVolume) + Number(sellVolume)) / total) * POOL : 0;
	console.log({ volume, total, usdTotal, tokens });

	return (
		<div className="w-full 2xl:w-2/3 m-auto">
			<div className="absolute top-0 right-0 -z-40">
				<Image src={bgTopRight} alt="backgroud image" />
			</div>
			<div className="p-6 md:mt-8 md:px-16 flex flex-col md:flex-row md:space-x-16 text-zinc-800 relative text-center md:text-left">
				<div className="w-full md:w-1/2 flex flex-col">
					<span className="font-extrabold text-4xl md:text-5xl">Trade on OpenPeer</span>
					<span className="font-extrabold text-transparent text-4xl md:text-5xl mb-4 bg-clip-text bg-gradient-to-r from-[#9B69F6] via-[#3CB5C9] to-[#3CB5C9]">
						receive rewards
					</span>
					<span className="text-base text-zinc-800">
						We&apos;re running a retroactive airdrop campaign with a monthly rewards pool. If you trade on
						OpenPeer, you will be rewarded based on your volume and providing liquidity to the protocol.
						<div className="underline hover:no-underline"> Read about details here.</div>
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
					<div className="flex flex-row items-center space-x-2">
						<span>
							<svg
								width="24"
								height="30"
								viewBox="0 0 24 30"
								fill="#25385A"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M8.30816 10.1983C7.5127 9.20175 6.1662 8.53503 4.93111 8.53503L4.93089 8.53505C3.76889 8.53505 2.51379 9.12605 1.70781 10.0234L11.2099 21.1644L8.30816 10.1983ZM9.05327 10.1112L11.9874 21.1956L14.9214 10.1112C14.0711 9.06852 13.0858 8.53498 11.9874 8.53498C10.8889 8.53498 9.90364 9.06852 9.05327 10.1112ZM12.7645 21.1642L22.2667 10.0232L22.2665 10.0232C21.4605 9.12583 20.2053 8.53485 19.0434 8.53485C17.8084 8.53485 16.4619 9.20154 15.6663 10.1981L12.7645 21.1642ZM23.1231 10.0171C23.1223 10.0467 23.117 10.0772 23.1083 10.1059C23.0601 10.2709 22.9085 10.4343 22.7801 10.5727C22.7419 10.6139 22.7057 10.653 22.6749 10.6891C22.564 10.8191 22.453 10.9491 22.3419 11.0791C22.2306 11.2094 22.1193 11.3396 22.0082 11.4699C21.8559 11.6487 21.7036 11.8274 21.5513 12.0061C21.3946 12.1899 21.2379 12.3738 21.0812 12.5579C20.8916 12.7802 20.702 13.0022 20.5124 13.2243C20.3286 13.4396 20.1448 13.6549 19.961 13.8704C19.7392 14.1303 19.5177 14.3902 19.2963 14.65C19.1032 14.8765 18.9102 15.1029 18.7172 15.3292L17.4169 16.8532C16.9878 17.3572 16.5587 17.8602 16.1287 18.3633L16.1245 18.3682C15.7238 18.8384 15.3231 19.3085 14.9224 19.7777C14.5699 20.192 14.2173 20.6054 13.8648 21.018C13.5919 21.3384 13.319 21.658 13.046 21.9776L13.024 22.0033L12.4705 22.6535C12.4502 22.6772 12.4301 22.7022 12.4097 22.7276C12.2975 22.8671 12.177 23.017 11.9848 23.0156C11.8122 23.0139 11.712 22.8962 11.609 22.7754L11.6001 22.7649L11.5966 22.7609C11.4402 22.5777 11.2838 22.3945 11.1274 22.2105C10.8646 21.9032 10.6017 21.5951 10.3389 21.2861C10.1106 21.0192 9.88243 20.7515 9.65421 20.4838C9.53863 20.3482 9.42305 20.2126 9.30746 20.0771C9.10713 19.8425 8.907 19.6078 8.70687 19.3731C8.50619 19.1378 8.3055 18.9025 8.10459 18.6671L6.80337 17.1413C6.57716 16.8759 6.3507 16.6105 6.12425 16.3451C5.90811 16.0917 5.69197 15.8384 5.47604 15.5851L4.19396 14.0828C3.80663 13.6275 3.41931 13.1732 3.03111 12.7189C2.86922 12.5287 2.7071 12.3387 2.54498 12.1487C2.38287 11.9588 2.22077 11.7688 2.05888 11.5787C1.98418 11.491 1.90948 11.4035 1.83481 11.316C1.67283 11.1262 1.51097 10.9366 1.34952 10.7466C1.29655 10.6841 1.24318 10.622 1.18969 10.5598C1.16494 10.531 1.14016 10.5022 1.11538 10.4733C1.10419 10.4598 1.09324 10.4462 1.0823 10.4325C1.06346 10.409 1.04468 10.3856 1.02486 10.3636C0.848168 10.166 0.843816 9.98147 0.896909 9.72819C0.94304 9.5045 0.996133 9.28428 1.05619 9.06408C1.17542 8.62976 1.32165 8.20239 1.49398 7.78547C1.83432 6.962 2.27559 6.18039 2.80131 5.46057C3.3244 4.7451 3.93107 4.09059 4.60387 3.51264C5.27755 2.93385 6.01653 2.4325 6.80248 2.02167C7.59455 1.60825 8.43536 1.2862 9.30139 1.06947C10.1788 0.849264 11.0823 0.736115 11.9875 0.736115C12.7664 0.736115 13.5445 0.819676 14.3061 0.98331C15.1808 1.17219 16.0329 1.46638 16.8389 1.85458C17.6388 2.24017 18.3943 2.71887 19.0863 3.27592C19.7765 3.8321 20.4041 4.46662 20.9498 5.16554C21.4981 5.86628 21.9647 6.63223 22.332 7.44342C22.5182 7.8525 22.6784 8.27289 22.8124 8.70199C22.8803 8.91871 22.9412 9.13719 22.9943 9.3574C23.006 9.40461 23.0196 9.45391 23.0336 9.50442C23.0802 9.67272 23.1305 9.85446 23.1231 10.0171ZM14.2888 27.9971H17.4404H17.4408H18.7071V29.2635H14.2888V27.9971ZM18.7067 23.0156V26.6486H12.6728V25.3823H17.4404V24.2819H14.7262V23.0156H18.7067ZM9.49179 27.9975V29.2639H5.28432V27.9975H9.49179ZM5.28432 26.6486V25.3823H5.28389V23.0156H9.20524V24.2819H6.55067V25.3823H11.3429V26.6486H5.28432Z" />
							</svg>
						</span>
						<span className="text-lg">Monthly airdrop</span>
					</div>
					<span>
						{address ? (
							<div className="border border-cyan-600 px-8 py-2 rounded-full text-cyan-600 hover:bg-cyan-800 hover:text-white transition ease-in-out hover:-translate-y-1 duration-200">
								Share it
							</div>
						) : (
							<ConnectButton />
						)}
					</span>
				</div>
				<div className="mt-4 w-full rounded-xl p-[4px] bg-gradient-to-r from-[#3C9AAA] to-[#2A4BE3]">
					<div className="flex flex-col p-8 justify-center items-center h-full bg-[#F4F6FB] text-white rounded-lg text-gray-800">
						<div className="flex flex-col md:flex-row md:space-x-20 items-center">
							<div>
								<div className="flex flex-col mb-4">
									<span>
										{Number(buyVolume).toFixed(2)} / {Number(usdTotal).toFixed(2)} USD
									</span>
									<span className="text-[#25385A] font-bold">Eligible buy volume</span>
									<span className="text-[#67738E] font-light">
										Crypto purchases between new verified users.
									</span>
								</div>
								<div className="flex flex-col mb-4">
									<span className="text-[#25385A] font-bold">What will be airdropped?</span>
									<span className="text-[#67738E] font-light">
										You will be rewarded with vP2P tokens based on your trade volume. This token
										will be convertible to our protocol&apos;s upcoming P2P token.
									</span>
								</div>
							</div>
							<div>
								<div className="flex flex-col mb-4">
									<span>
										{Number(sellVolume).toFixed(2)} / {Number(usdTotal).toFixed(2)} USD
									</span>
									<span className="text-[#25385A] font-bold">Eligible sell volume</span>
									<span className="text-[#67738E] font-light">
										Crypto sales between new verified users.
									</span>
								</div>
								<div className="flex flex-col mb-4">
									<span className="text-[#25385A] font-bold">How to collect your reward?</span>
									<span className="text-[#67738E] font-light">
										After the countdown hits zero and this month&apos;s epoch ends, the calculated
										reward will be airdropped to your eligible wallet by the team.
									</span>
								</div>
							</div>
							<div className="flex justify-center items-center text-center">
								<div className="rounded-full mt-6 md:mt-0 p-[4px] bg-gradient-to-r from-[#6FD9EC] to-[#6BA4F8]">
									<div className="flex flex-col w-[200px] h-[200px] md:w-[220px] md:h-[220px] p-10 justify-center items-center text-white bg-gradient-to-r from-[#2C76E5] to-[#6FD9EC] rounded-full p-8 text-gray-800">
										<span className="text-white text-base mb-2">Elegible for</span>
										<span className="text-white text-5xl font-bold mb-2">{tokens}</span>
										<span className="text-white text-2xl">vP2P</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="p-8 m-auto text-sm text-gray-400">OpenPeer {new Date().getFullYear()}</div>
				<div className="absolute bottom-40 left-0 -z-40">
					<Image src={bgBottomLeft} alt="background image" />
				</div>
			</div>
		</div>
	);
};

export async function getServerSideProps() {
	return {
		props: { title: 'Airdrop', disableAuthentication: true } // will be passed to the page component as props
	};
}
export default AirdropPage;
