import Avatar from 'components/Avatar';
import VerificationButton from 'components/Button/VerificationButton';
import { VerifiedIcon } from 'components/Icons';
import { providers } from 'ethers';
import { useVerification } from 'hooks';
import { User } from 'models/types';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { smallWalletAddress } from 'utils';
import { useAccount, useNetwork } from 'wagmi';

import {
	ArrowLongLeftIcon,
	CalendarDaysIcon,
	CalendarIcon,
	ChartBarIcon,
	ChartBarSquareIcon,
	StarIcon
} from '@heroicons/react/24/outline';
import Synaps from '@synaps-io/react-verify';

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

interface HeaderMetricsParams {
	user: User;
}

const getTimePassed = (timestamp: number): string => {
	const now = Date.now() / 1000; // convert milliseconds to seconds
	const secondsPassed = now - timestamp;
	const minutesPassed = secondsPassed / 60;
	const hoursPassed = minutesPassed / 60;
	const daysPassed = hoursPassed / 24;
	const yearsPassed = daysPassed / 365;

	if (yearsPassed >= 1) {
		return `${Math.floor(yearsPassed)} years`;
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

const HeaderMetrics = ({ user }: HeaderMetricsParams) => {
	const { trades, created_at: createdAt, name, twitter, address, completion_rate: completionRate } = user;
	const date = new Date(createdAt);
	const [walletAge, setWalletAge] = useState<string>();
	const [verificationModal, setVerificationModal] = useState(false);
	const { chain } = useNetwork();
	const { address: connectedAddress } = useAccount();
	const { verification, verified, verifyStatus } = useVerification();

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
		}
	}, [address]);

	if (verificationModal && !!verification) {
		const onFinish = async () => {
			await verifyStatus();
			setVerificationModal(false);
		};
		return (
			<div className="w-full justify-center flex flex-col md:flex-row mb-8 md:mt-8 px-6 pt-6 md:p-0">
				<div>
					<div
						className="flex flex-row items-center cursor-pointer"
						onClick={() => setVerificationModal(false)}
					>
						<ArrowLongLeftIcon width={24} />
						<span className="pl-2">Back</span>
					</div>
					<Synaps sessionId={verification.session_id} service="individual" lang="en" onFinish={onFinish} />
				</div>
			</div>
		);
	}

	return (
		<div className="w-full justify-center flex flex-col md:flex-row mb-8 md:mt-8 px-6 pt-6 md:p-0">
			<div className="w-full md:w-1/4 flex justify-center items-center text-center rounded-lg bg-white border border-1 p-8 mr-6 mb-6 md:mb-0">
				<div className="flex flex-col items-center">
					<span className="m-auto flex items-center justify-center bg-gray-50 w-24 h-24 rounded-full">
						<Avatar user={user} className="inline-block h-20 w-20" />
					</span>
					<div className="flex items-center pl-4 text-lg mb-2 mt-4">
						<span className="mr-2">{name || smallWalletAddress(address)}</span>
						{verified && (
							<span>
								<VerifiedIcon />
							</span>
						)}
					</div>
					{!!twitter && (
						<span className="text-sm mb-4">
							<Link href={`https://twitter.com/${twitter}/`}>
								{twitter.startsWith('@') ? '' : '@'}
								{twitter}
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
									{!verified && <VerificationButton onClick={() => setVerificationModal(true)} />}
								</>
							) : (
								<Link
									href={`${chain.blockExplorers!.default.url}/address/${address}`}
									className="flex items-center py-2 px-6 border rounded"
									target="_blank"
								>
									View on {chain.blockExplorers!.default.name}
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
	);
};

export default HeaderMetrics;
