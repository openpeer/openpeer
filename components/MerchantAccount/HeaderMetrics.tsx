import Avatar from 'components/Avatar';
import QuadrataClient from 'components/QuadrataClient';
import { providers } from 'ethers';
import { useVerificationStatus, useAccount } from 'hooks';
import { User } from 'models/types';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { smallWalletAddress } from 'utils';
import { useNetwork, useSwitchNetwork } from 'wagmi';

import {
	CalendarDaysIcon,
	CalendarIcon,
	ChartBarIcon,
	ChartBarSquareIcon,
	StarIcon
} from '@heroicons/react/24/outline';
import { polygon } from '@wagmi/chains';

const Metric = ({
	label,
	value,
	Icon
}: {
	label: string;
	value: string | number | undefined | null;
	Icon: (props: any) => JSX.Element;
}) => (
	<div className="w-full flex justify-between items-center rounded-lg bg-white border border-1 p-8">
		<div className="flex flex-col">
			<span className="text-sm text-gray-500">{label}</span>
			<span>{value || 'Loading...'}</span>
		</div>
		<div>
			<div className="bg-gray-50 p-4 rounded-full">
				<Icon className="h-5 w-5 z-50 text-cyan-600" aria-hidden="true" />
			</div>
		</div>
	</div>
);

interface HeaderMetricsProps {
	user: User;
	verificationOpen: boolean;
}

const getTimePassed = (timestamp: number): string => {
	const now = Date.now() / 1000; // convert milliseconds to seconds
	const secondsPassed = now - timestamp;
	const minutesPassed = secondsPassed / 60;
	const hoursPassed = minutesPassed / 60;
	const daysPassed = hoursPassed / 24;
	const yearsPassed = daysPassed / 365;

	if (yearsPassed >= 1) {
		return `${Math.floor(yearsPassed)} ${yearsPassed >= 2 ? 'years' : 'year'}`;
	}
	if (daysPassed >= 30) {
		const monthsPassed = daysPassed / 30;
		return `${Math.floor(monthsPassed)} months`;
	}
	if (daysPassed >= 1) {
		return `${Math.floor(daysPassed)} days`;
	}
	return 'less than a day';
};

const VerifiedIcon = () => (
	<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M15.5173 7.60444L14.4829 6.32107C14.3201 6.11037 14.2148 5.86136 14.186 5.58362L14.0041 3.95547C13.9671 3.63036 13.8211 3.32738 13.5897 3.09602C13.3584 2.86466 13.0554 2.71859 12.7303 2.68168L11.1021 2.49971C10.8148 2.47098 10.5658 2.34647 10.3551 2.18366L9.07173 1.1493C8.54497 0.727901 7.79794 0.727901 7.27118 1.1493L5.98782 2.18366C5.77712 2.34647 5.52811 2.45182 5.25036 2.48056L3.62222 2.66253C2.9518 2.73914 2.42505 3.2659 2.34843 3.93631L2.16646 5.56446C2.13773 5.85178 2.01322 6.10079 1.85041 6.31149L0.816052 7.59486C0.394649 8.12161 0.394649 8.86865 0.816052 9.3954L1.85041 10.6788C2.01322 10.8895 2.11857 11.1385 2.1473 11.4162L2.32927 13.0444C2.40589 13.7148 2.93265 14.2415 3.60306 14.3182L5.23121 14.5001C5.51853 14.5289 5.76754 14.6534 5.97824 14.8162L7.26161 15.8505C7.78836 16.2719 8.53539 16.2719 9.06215 15.8505L10.3455 14.8162C10.5562 14.6534 10.8052 14.548 11.083 14.5193L12.7111 14.3373C13.3815 14.2607 13.9083 13.7339 13.9849 13.0635L14.1669 11.4354C14.1956 11.1481 14.3201 10.899 14.4829 10.6883L15.5173 9.40498C15.9387 8.87822 15.9387 8.13119 15.5173 7.60444ZM6.73485 12.3356L3.38278 8.98357L4.81938 7.54697L6.73485 9.46244L11.5235 4.67377L12.9601 6.15826L6.73485 12.3356Z"
			fill="#020AD4"
		/>
	</svg>
);

const HeaderMetrics = ({ user, verificationOpen }: HeaderMetricsProps) => {
	const {
		trades,
		created_at: createdAt,
		name,
		twitter,
		telegram_username,
		address,
		completion_rate: completionRate
	} = user;
	const date = new Date(createdAt);
	const [walletAge, setWalletAge] = useState<string>();
	const [verificationModal, setVerificationModal] = useState(verificationOpen);
	const { chain } = useNetwork();
	const { address: connectedAddress } = useAccount();
	const { switchNetwork } = useSwitchNetwork();
	const { verified, fetchVerificationStatus } = useVerificationStatus(address);

	const openVerificationModal = () => {
		if (chain?.id === polygon.id) {
			setVerificationModal(true);
		} else {
			switchNetwork?.(polygon.id);
		}
	};

	useEffect(() => {
		const fetchWalletAge = async () => {
			const provider = new providers.EtherscanProvider();
			const history = await provider.getHistory(address);
			const [firstTransaction] = history;

			if (firstTransaction?.timestamp) {
				setWalletAge(getTimePassed(firstTransaction.timestamp));
			}
		};

		if (address) {
			fetchWalletAge();
			fetchVerificationStatus();
		}
	}, [address]);

	const onFinish = async () => {
		await fetchVerificationStatus();
		setVerificationModal(false);
	};

	return (
		<>
			<div className="w-full justify-center flex flex-col md:flex-row mb-8 md:mt-8 px-6 pt-6 md:p-0">
				<div className="w-full md:w-1/4 flex justify-center items-center text-center rounded-lg bg-white border border-1 p-4 mr-6 mb-6 md:mb-0">
					<div className="flex flex-col items-center">
						<span className="m-auto flex items-center justify-center bg-gray-50 w-24 h-24 rounded-full">
							<Avatar user={user} className="inline-block h-20 w-20" />
						</span>
						<div className="flex flex-col mb-2">
							<div className="flex items-center pl-4 text-lg my-2">
								<span className="mr-2">{name || smallWalletAddress(address)}</span>
								{verified && (
									<span>
										<VerifiedIcon />
									</span>
								)}
							</div>
							{user.online !== null && (
								<div className="flex justify-center text-sm">
									{user.online ? (
										<div className="flex flex-row items-center space-x-1">
											<div className="w-2 h-2 bg-green-500 rounded-full" />
											<span className="text-green-500 text-xs">Online</span>
										</div>
									) : (
										<div className="flex flex-row items-center space-x-1">
											<div className="w-2 h-2 bg-orange-500 rounded-full" />
											<span className="text-orange-500 text-xs">Not online now</span>
										</div>
									)}
								</div>
							)}
						</div>
						{!!twitter && (
							<span className="text-sm mb-4 flex items-center">
								<Link href={`https://x.com/${twitter}/`} className="flex items-center" target="_blank">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										strokeWidth="2"
										stroke="currentColor"
										fill="none"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="mr-1"
									>
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<path d="M4 4l11.733 16h4.267l-11.733 -16z" />
										<path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
									</svg>
									{twitter.startsWith('@') ? '' : '@'}
									{twitter}
								</Link>
							</span>
						)}
						{!!telegram_username && (
							<span className="text-sm mb-4 flex items-center">
								<Link
									href={`https://t.me/${telegram_username}`}
									className="flex items-center"
									target="_blank"
								>
									<svg
										width="24"
										height="24"
										viewBox="0 0 32 32"
										className="mr-1"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_7225)" />
										<path
											d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z"
											fill="white"
										/>
										<defs>
											<linearGradient
												id="paint0_linear_87_7225"
												x1="16"
												y1="2"
												x2="16"
												y2="30"
												gradientUnits="userSpaceOnUse"
											>
												<stop stopColor="#37BBFE" />
												<stop offset="1" stopColor="#007DBB" />
											</linearGradient>
										</defs>
									</svg>
									{telegram_username.toLowerCase()}
								</Link>
							</span>
						)}
						{!!chain && (
							<div className="flex flex-row">
								{user.address === connectedAddress ? (
									<>
										<Link
											href={`/${address}/edit`}
											className="flex items-center py-2 px-6 border rounded"
										>
											Edit profile
										</Link>
										<button
											type="button"
											className="flex items-center py-2 px-6 border rounded ml-2 cursor-pointer"
											onClick={openVerificationModal}
										>
											{verified ? '' : 'Get'} Verified
											<span className="ml-2">
												<VerifiedIcon />
											</span>
										</button>
									</>
								) : (
									<Link
										href={`${chain.blockExplorers!.default.url}/address/${address}`}
										className="flex items-center py-2 px-6 border rounded"
										target="_blank"
									>
										View on{' '}
										{chain.blockExplorers!.etherscan?.name || chain.blockExplorers!.default.name}
									</Link>
								)}
							</div>
						)}
					</div>
				</div>
				<div>
					<div className="w-full flex flex-col md:flex-row justify-around gap-6">
						<Metric
							label="Joined"
							value={date.toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'short',
								day: 'numeric'
							})}
							Icon={CalendarDaysIcon}
						/>
						<Metric label="Wallet Age" value={walletAge} Icon={CalendarIcon} />
						<Metric label="Trades" value={trades.toString()} Icon={ChartBarIcon} />
					</div>

					<div className="w-full flex flex-col md:flex-row justify-around gap-6 mt-4">
						<Metric label="Reviews" value="Coming soon..." Icon={StarIcon} />
						<Metric
							label="Completion Rate"
							value={completionRate ? `${(completionRate * 100).toFixed(2)}%` : 'No trades'}
							Icon={ChartBarSquareIcon}
						/>
						{/* <Metric label="Avg Trade Completion" value="5 minutes" Icon={ClockIcon} /> */}
					</div>
				</div>
			</div>
			<QuadrataClient
				onFinish={onFinish}
				open={verificationModal && !verified}
				onHide={() => setVerificationModal(false)}
			/>
		</>
	);
};

export default HeaderMetrics;
