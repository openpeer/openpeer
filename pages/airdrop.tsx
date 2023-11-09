/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/indent */
import { VP2P } from 'abis';
import { Button } from 'components';
import TransactionLink from 'components/TransactionLink';
import { useTransactionFeedback, useAccount } from 'hooks';
import { Airdrop } from 'models/types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import bgBottomLeft from 'public/airdrop/bgAirdropBottomLeft.png';
import bgTopRight from 'public/airdrop/bgAirdropTopRight.png';
import React, { useEffect, useState } from 'react';
import Countdown from 'react-countdown';

import {
	useContractRead,
	useContractWrite,
	useNetwork,
	usePrepareContractWrite,
	useSwitchNetwork,
	useWaitForTransaction
} from 'wagmi';
import { polygon } from 'wagmi/chains';

import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { formatUnits, parseUnits } from 'viem';
import { DynamicWidget, getAuthToken } from '@dynamic-labs/sdk-react';
import roundTree from '../airdrop/roundFiveTree.json';

interface RoundData {
	[key: `0x${string}`]: {
		buy_volume: string;
		sell_volume: string;
	};
}

interface ClosedRound {
	[key: number]: {
		volume: number;
		data: RoundData;
	};
}

const CLOSED_ROUND = 5;
const ROUND = 6;
const POOL = 1000000;
const AIRDROP_START = 1701432000000;
const CHAIN = polygon;
const CONTRACT_ADDRESS = '0x40D8250eFFcC13297B24B264Ea839296c34128C8';
const CLOSED_ROUNDS: ClosedRound = {
	2: {
		// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
		volume: 1567.09850225354078480242151,
		data: {
			'0xB98206A86e61bc59E9632D06679a5515eBf02e81': {
				buy_volume: '0',
				sell_volume: '549.7756'
			},
			'0xFE6b7A4494B308f8c0025DCc635ac22630ec7330': {
				buy_volume: '579.76336',
				sell_volume: '115.382818595088'
			},
			'0x9eab86EA2395c361eDA500F5094ABCF0BE825713': {
				buy_volume: '115.382818595088',
				sell_volume: '29.98776'
			},
			'0x088Ba7c136f64B692D1822F12409b2e4a4f239E9': {
				buy_volume: '0',
				sell_volume: '6.709746480468568151712'
			},
			'0xcd2523e1ea097Aec34Dfff62312BF27568A17643': {
				buy_volume: '6.86875416692067466166',
				sell_volume: '0'
			},
			'0x501DeFc41e7c9a9C17702c7c432124794Ee99c72': {
				buy_volume: '241.769172',
				sell_volume: '244.164228187447219176668'
			},
			'0xA1Be19349c296C4c7125894672EbC1756493617a': {
				buy_volume: '24.315865',
				sell_volume: '52.105425'
			},
			'0x1fDa15a7D17efbc3e8a11Fbaea63fb405cfB3C32': {
				buy_volume: '52.105425',
				sell_volume: '24.315865'
			},
			'0x198a0a2fa5B012e4646E7240dDFb16529967d72b': {
				buy_volume: '0.06135289139936206207451',
				sell_volume: '0'
			},
			'0xeC8dD93C481cBE0c8658f7673f16343a72Af9c3D': {
				buy_volume: '6.709746480468568151712',
				sell_volume: '6.86875416692067466166'
			},
			'0x8A57DCEda6F8CDa5B99BC83aC64F659f63b926f7': {
				buy_volume: '244.164228187447219176668',
				sell_volume: '243.853389'
			},
			'0xF07CF0C322e146aC6a47C13F9533E42D81567eF7': {
				buy_volume: '243.853389',
				sell_volume: '241.769172'
			},
			'0xF3b20A83e4E621AAaa53f609a84CdFA29ebc13Ca': {
				buy_volume: '6.946770305949513795261',
				sell_volume: '6.946975626267446955046'
			},
			'0x23dbF13709AD6B94111059F7B41a7460af28b6E0': {
				buy_volume: '6.946975626267446955046',
				sell_volume: '6.946770305949513795261'
			},
			'0x4f3931aadbE087de9E572765B64744714428BD0A': {
				buy_volume: '12.505302',
				sell_volume: '25.705343'
			},
			'0x21837bc754EB9289ced8BeA462ED64541EF078cB': {
				buy_volume: '25.705343',
				sell_volume: '12.505302'
			},
			'0x39550F20857A8a3B848009cF907A8d82Cf3a6e7f': {
				buy_volume: '0',
				sell_volume: '0.06135289139936206207451'
			}
		}
	},
	3: {
		// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
		volume: 1936.99951567847137282304,
		data: {
			'0xB98206A86e61bc59E9632D06679a5515eBf02e81': {
				buy_volume: '21.8420931635',
				sell_volume: '1121.3745931635'
			},
			'0xFE6b7A4494B308f8c0025DCc635ac22630ec7330': {
				buy_volume: '1131.3703431635',
				sell_volume: '661.9221647546536900425'
			},
			'0x9eab86EA2395c361eDA500F5094ABCF0BE825713': { buy_volume: '224.904375', sell_volume: '9.99575' },
			'0x4F20CBb1149BE8839A3554189098b67c21BCb587': { buy_volume: '0', sell_volume: '76.7030877603176883642' },
			'0xF3b20A83e4E621AAaa53f609a84CdFA29ebc13Ca': {
				buy_volume: '33.50196',
				sell_volume: '33.50195999999999441634'
			},
			'0x23dbF13709AD6B94111059F7B41a7460af28b6E0': {
				buy_volume: '33.50195999999999441634',
				sell_volume: '33.50196'
			},
			'0x920EFA6f544FE9050a0Aa4181911C75CdD5F8a23': { buy_volume: '76.7030877603176883642', sell_volume: '0' },
			'0xaea5a33Bdf3f33769026beea245c6394EEAdE67F': { buy_volume: '390.1863215911536900425', sell_volume: '0' },
			'0x60D188c083D0027B8884b61a0Ec6F50A71BBE994': { buy_volume: '24.989375', sell_volume: '0' }
		}
	},
	4: {
		// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
		volume: 2444.1940945122468544272495,
		data: {
			'0xB98206A86e61bc59E9632D06679a5515eBf02e81': { buy_volume: '0.110679', sell_volume: '1000.0' },
			'0xFE6b7A4494B308f8c0025DCc635ac22630ec7330': { buy_volume: '1002.0', sell_volume: '0' },
			'0x630220d00Cf136270f553c8577aF18300F7b812c': { buy_volume: '0', sell_volume: '0.110679' },
			'0x9eab86EA2395c361eDA500F5094ABCF0BE825713': { buy_volume: '4.289806', sell_volume: '4.287631' },
			'0xfF99AF5c7bBe33b8Eb34a124f97A2CDe180640A0': { buy_volume: '0', sell_volume: '2.0' },
			'0xF3b20A83e4E621AAaa53f609a84CdFA29ebc13Ca': {
				buy_volume: '471.34468637404579818945',
				sell_volume: '503.036055'
			},
			'0x23dbF13709AD6B94111059F7B41a7460af28b6E0': {
				buy_volume: '503.036055',
				sell_volume: '471.34468637404579818945'
			},
			'0x9518d5744E6e39842c6a8fbCfc616ca7B67f2cFa': { buy_volume: '0', sell_volume: '454.352557127312296' },
			'0x8240b3991aA6A225585309663a74213d25617016': { buy_volume: '4.352557127312296', sell_volume: '0' },
			'0xFB48EFfcDC15160d6f3f94D1d12B6E4f4e29d671': { buy_volume: '4.287631', sell_volume: '4.289806' },
			'0x3992BD6a739b9B2932FcD7dab572a009F88b9b3d': { buy_volume: '200.0', sell_volume: '0' },
			'0x135133f344d0dD67e99C6106B1C0066A1B3EF263': { buy_volume: '250.0', sell_volume: '0' },
			'0x1731D34B07CA2235E668c7B0941d4BfAB370a2d0': { buy_volume: '0', sell_volume: '4.313738596110696590835' },
			'0x871b62f813b5F6E12Dd7689606C0bE9855C06D7B': { buy_volume: '0', sell_volume: '0.4589414147780636469645' },
			'0xBE42A09D29Bfa9Ee0f2f7d41eb25aC35a14627aa': { buy_volume: '0.4589414147780636469645', sell_volume: '0' },
			'0x683287150dE08509909E7efA8e4609DA8E34360F': { buy_volume: '4.313738596110696590835', sell_volume: '0' }
		}
	},
	5: {
		// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
		volume: 5375.38372451445252876644,
		data: {
			'0xB98206A86e61bc59E9632D06679a5515eBf02e81': { buy_volume: '0', sell_volume: '0.227037872092404582' },
			'0xFE6b7A4494B308f8c0025DCc635ac22630ec7330': {
				buy_volume: '1576.296191252592404582',
				sell_volume: '1874.89372737458289576684'
			},
			'0x9eab86EA2395c361eDA500F5094ABCF0BE825713': {
				buy_volume: '52.89545937881889576684',
				sell_volume: '9.99867'
			},
			'0x4F20CBb1149BE8839A3554189098b67c21BCb587': {
				buy_volume: '1369.068323153045',
				sell_volume: '1950.6507751645522284176'
			},
			'0xF3b20A83e4E621AAaa53f609a84CdFA29ebc13Ca': { buy_volume: '485.25477', sell_volume: '485.25477' },
			'0x23dbF13709AD6B94111059F7B41a7460af28b6E0': { buy_volume: '485.25477', sell_volume: '485.25477' },
			'0x920EFA6f544FE9050a0Aa4181911C75CdD5F8a23': { buy_volume: '30.015286937501322098', sell_volume: '0' },
			'0x9518d5744E6e39842c6a8fbCfc616ca7B67f2cFa': { buy_volume: '0', sell_volume: '259.96542' },
			'0x135133f344d0dD67e99C6106B1C0066A1B3EF263': { buy_volume: '199.9734', sell_volume: '0' },
			'0xe172Bd02F842e98183cDBb8294Bf23f625588D9e': { buy_volume: '353.212205000119', sell_volume: '0' },
			'0x85D3Af356773EC8614d596ca3540968Bd40FFd14': { buy_volume: '99.166484103225', sell_volume: '0' },
			'0xE661b1030876F28FD2EAfdAe28d6280B3f198093': { buy_volume: '0', sell_volume: '99.166484103225' },
			'0xeb2c2037017f93D22e2981061fEd4AE13F77E0d3': { buy_volume: '59.99202', sell_volume: '0' },
			'0x6408F0b3313d9C63b5E234B4A6371Cba1A83a082': { buy_volume: '0', sell_volume: '9.99867' },
			'0x87D5aF6B03178187489D8211feD16FCd3D56c7E0': { buy_volume: '9.99867', sell_volume: '0' },
			'0x20FB270652138a12EC8607e93199A233A8c517f0': { buy_volume: '99.7177398426', sell_volume: '0' },
			'0xcADD30BF714deE4a8496D09F9DF5aB9708e66600': { buy_volume: '359.422871120134695736', sell_volume: '0' },
			'0xD22aE82D698740c151141F9e3e11768d42416d06': { buy_volume: '195.1155337264162105836', sell_volume: '0' },
			'0xDc0981eaB09B6c27a02ce77a55d66e5C29f5cdB9': { buy_volume: '0', sell_volume: '199.9734' }
		}
	}
};

const CallToActionButton = ({ address }: { address: `0x${string}` | undefined }) => {
	const router = useRouter();

	if (!address) {
		return <DynamicWidget />;
	}

	return <Button title="Start trading" onClick={() => router.push('/trade')} />;
};

const ClaimRewardsButton = ({ tokens }: { tokens: number }) => {
	const { chain } = useNetwork();
	const { address, isConnected } = useAccount();
	const wrongChain = CHAIN.id !== chain?.id;
	const amount = parseUnits(tokens.toString(), 18);
	// @ts-expect-error
	const merkleTree = StandardMerkleTree.load(roundTree);
	const index = address ? Object.keys(CLOSED_ROUNDS[CLOSED_ROUND].data).indexOf(address) : -1;
	const proof = address && index >= 0 ? merkleTree.getProof(index) : [];
	const { switchNetwork } = useSwitchNetwork();

	const {
		isLoading: claimCheckLoading,
		isSuccess: claimChecked,
		data: claimed
	} = useContractRead({
		abi: VP2P,
		address: CONTRACT_ADDRESS,
		args: [CLOSED_ROUND, address],
		functionName: 'redeemedBy',
		enabled: !wrongChain && !!address
	});

	const { config } = usePrepareContractWrite({
		address: CONTRACT_ADDRESS,
		abi: VP2P,
		functionName: 'claim',
		args: [CLOSED_ROUND, amount, proof],
		gas: BigInt('150000'),
		enabled: !wrongChain && !!address && !!proof.length
	});

	const { data, write: claim } = useContractWrite(config);

	const { isSuccess, isLoading } = useWaitForTransaction({
		hash: data?.hash
	});

	const onClaimRewards = async () => {
		if (wrongChain) {
			switchNetwork?.(CHAIN.id);
		} else {
			claim?.();
		}
	};

	useTransactionFeedback({
		hash: data?.hash,
		isSuccess,
		Link: <TransactionLink hash={data?.hash} />,
		description: 'Claimed OpenPeer Rewards'
	});

	if (!isConnected) {
		return <DynamicWidget />;
	}

	return (
		<Button
			title={
				wrongChain
					? `Switch to ${CHAIN.name}`
					: !proof.length
					? 'No tokens to claim'
					: claimChecked && (claimed as boolean)
					? 'Claimed'
					: 'Claim Rewards'
			}
			onClick={onClaimRewards}
			disabled={
				isLoading ||
				claimCheckLoading ||
				!proof.length ||
				!!(!wrongChain && proof.length && !claim) ||
				(claimChecked && (claimed as boolean))
			}
		/>
	);
};

const AirdropCountdown = ({ address }: { address: `0x${string}` | undefined }) => {
	const renderer = ({
		days,
		hours,
		minutes,
		seconds
	}: {
		days: number;
		hours: number;
		minutes: number;
		seconds: number;
		completed: boolean;
	}) => (
		<div className="p-6">
			<div className="mb-4 font-light text-zinc-500 md:text-xl text-center">Time until the next airdrop</div>

			<div className="flex flex-row space-x-2 w-[300px]">
				{days > 0 && (
					<div className="flex items-center justify-around space-x-2">
						<span className="text-2xl md:text-3xl font-bold">{days}</span>
						<span className="font-light">{days >= 2 ? 'days' : 'day'}</span>
					</div>
				)}
				<div className="flex items-center justify-around space-x-2">
					<span className="text-2xl md:text-3xl font-bold">{hours}</span>
					<span className="font-light">{hours === 1 ? 'hour' : 'hours'}</span>
				</div>
				<div className="flex items-center justify-around space-x-2">
					<span className="text-xl md:text-3xl font-bold">{minutes}</span>
					<span className="font-light">{minutes === 1 ? 'min' : 'mins'}</span>
				</div>
				<div className="flex items-center justify-around space-x-2">
					<span className="text-xl md:text-3xl font-bold">{seconds}</span>
					<span className="font-light">{seconds === 1 ? 'sec' : 'secs'}</span>
				</div>
			</div>
			<div className="my-4 flex justify-center">
				<div className="inline-block">
					<CallToActionButton address={address} />
				</div>
			</div>
		</div>
	);

	return (
		<div className="flex flex-col justify-center items-center p-4 md:p-0 h-full bg-white text-white rounded-lg text-gray-800">
			<Countdown date={AIRDROP_START} renderer={renderer} />
		</div>
	);
};

const AirdropPage = () => {
	const [volume, setVolume] = useState<Airdrop>({} as Airdrop);
	const { address } = useAccount();

	const { buy_volume: buyVolume = 0, sell_volume: sellVolume = 0 } = volume;

	const usdTotal = (Number(volume.total || 0) || 0) * 2; // times two because buyer and seller get the same amount
	const tokens = address && usdTotal ? ((Number(buyVolume) + Number(sellVolume)) / usdTotal) * POOL : 0;

	const closedRoundTokensInfo = address ? roundTree.values.find((line) => line.value[0] === address) : undefined;

	const closedRoundTokens = closedRoundTokensInfo
		? Number(formatUnits(BigInt(closedRoundTokensInfo.value[1]), 18))
		: 0;

	useEffect(() => {
		if (!address) return;
		fetch(`/api/airdrop?address=${address}&round=${ROUND}`, {
			headers: {
				Authorization: `Bearer ${getAuthToken()}`
			}
		})
			.then((res) => res.json())
			.then((data) => {
				if (!data.message) {
					setVolume(data);
				}
			});
	}, [address]);

	return (
		<div className="w-full 2xl:w-2/3 m-auto">
			<div className="absolute top-0 right-0 -z-40">
				<Image src={bgTopRight} alt="backgroud image" />
			</div>
			<div className="p-6 md:mt-8 md:px-16 flex flex-col md:flex-row md:space-x-16 text-zinc-800 relative text-center md:text-left">
				<div className="w-full md:w-2/3 m-auto text-center flex flex-col">
					<span className="font-extrabold text-4xl md:text-5xl">Trade on OpenPeer</span>
					<span className="font-extrabold text-transparent text-4xl md:text-5xl mb-4 bg-clip-text bg-gradient-to-r from-[#9B69F6] via-[#3CB5C9] to-[#3CB5C9]">
						receive rewards
					</span>
					<span className="text-base text-zinc-800">
						We&apos;re running a retroactive airdrop campaign with a monthly rewards pool. If you trade on
						OpenPeer, you will be rewarded based on your volume and providing liquidity to the protocol.
						<Link href="https://blog.openpeer.xyz/openpeer-rewards-campaign" target="_blank">
							<div className="ml-2 underline inline-block hover:no-underline cursor-pointer">
								Read about details here.
							</div>
						</Link>
					</span>
				</div>
			</div>
			<div className="p-4 md:px-16 flex flex-col text-[#25385A]">
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
							<Link
								href="https://twitter.com/intent/tweet?text=I've started trading P2P on OpenPeer a new decentralized P2P exchange backed by Outlier and Polygon Ventures @openpeer_xyz - you can earn rewards at https://app.openpeer.xyz/airdrop"
								target="_blank"
							>
								<div className="flex items-center border border-cyan-600 px-8 py-2 rounded-full text-cyan-600 hover:bg-gradient-to-r from-purple-200 via-cyan-50 to-cyan-200 transition ease-in-out hover:-translate-y-1 duration-300 cursor-pointer">
									<svg width="20" height="20" fill="currentColor" className="text-cyan-600 mr-2">
										<path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
									</svg>
									Share it
								</div>
							</Link>
						) : (
							<DynamicWidget />
						)}
					</span>
				</div>
				<div className="mt-4 w-full rounded-xl p-[4px] bg-gradient-to-r from-[#3C9AAA] to-cyan-600">
					<div className="flex flex-col p-8 justify-center items-center h-full bg-[#F4F6FB] text-white rounded-lg text-gray-800">
						<div className="flex flex-col lg:flex-row lg:space-x-20 items-center">
							<div>
								<div className="flex flex-col mb-4">
									<span>
										{Number(buyVolume).toFixed(2)} / {Number(usdTotal).toFixed(2)} USD
									</span>
									<span className="text-[#25385A] font-bold">Eligible buy volume</span>
									<span className="text-[#67738E] font-light">Crypto purchases between users.</span>
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
									<span className="text-[#67738E] font-light">Crypto sales between new users.</span>
								</div>
								<div className="flex flex-col mb-4">
									<span className="text-[#25385A] font-bold">How to collect your reward?</span>
									<span className="text-[#67738E] font-light">
										After the countdown hits zero and this month&apos;s epoch ends, the calculated
										reward will be available to redeem
									</span>
								</div>
							</div>
							<div className="flex justify-center items-center text-center">
								<div className="rounded-full mt-6 md:mt-0 p-[4px] bg-gradient-to-r from-[#6FD9EC] to-[#6BA4F8]">
									<div className="flex flex-col w-[200px] h-[200px] md:w-[220px] md:h-[220px] p-10 justify-center items-center text-white bg-gradient-to-r from-[#2C76E5] to-[#6FD9EC] rounded-full p-8 text-gray-800">
										<span className="text-white text-base mb-2">Eligible for</span>
										<span className="text-white text-4xl font-bold mb-2">
											{Number(tokens).toFixed(2)}
										</span>
										<span className="text-white text-2xl">vP2P</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="absolute bottom-40 left-0 -z-40">
					<Image src={bgBottomLeft} alt="background image" />
				</div>
			</div>
			<div className="p-6 md:px-16 flex flex-col md:flex-row md:space-x-10 text-zinc-800 relative text-center md:text-left">
				<div className="w-full mt-8 md:mt-0 md:w-1/2 rounded-xl mx-auto p-[4px] bg-gradient-to-r from-[#3C9AAA] to-cyan-600">
					<AirdropCountdown address={address} />
				</div>
				<div className="w-full mt-8 md:mt-0 md:w-1/2 rounded-xl mx-auto p-[4px] bg-gradient-to-r from-[#3C9AAA] to-cyan-600">
					<div className="flex flex-col justify-center items-center p-4 md:p-0 h-full bg-white text-white rounded-lg text-gray-800">
						<div className="mb-4 font-light text-zinc-500 md:text-xl text-center">Past rewards</div>
						<div className="flex flex-row items-center space-x-2">
							<span className="text-xl md:text-3xl font-bold">{closedRoundTokens}</span>
							<span className="font-light">vP2P</span>
						</div>
						<div className="my-4">
							<ClaimRewardsButton tokens={closedRoundTokens} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export async function getServerSideProps() {
	return {
		props: { title: 'Airdrop', simpleLayout: true } // will be passed to the page component as props
	};
}
export default AirdropPage;
