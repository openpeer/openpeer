import 'react-wallet-chat/dist/index.css';

import Avatar from 'components/Avatar';
import Image from 'next/image';
import Link from 'next/link';
import { smallWalletAddress } from 'utils';
import { useAccount } from 'wagmi';

import { ChartBarSquareIcon, StarIcon } from '@heroicons/react/24/outline';

import { UIOrder } from './Buy.types';
import Chat from './Chat';

const SummaryBuy = ({ order }: { order: UIOrder }) => {
	const { list, price, fiat_amount: fiatAmount, token_amount: tokenAmount, buyer } = order;
	const {
		fiat_currency: currency,
		limit_min: limitMin,
		limit_max: limitMax,
		payment_method: paymentMethod,
		seller,
		token,
		total_available_amount: totalAvailableAmount,
		terms
	} = list!;

	const { address } = useAccount();
	const selling = seller.address === address;
	const chatAddress = selling ? buyer.address : seller.address;
	const user = !!selling && !!buyer ? buyer : seller;

	return (
		<div className="w-2/4 hidden md:inline-block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm md:ml-16 md:px-8 md:py-4 p-4">
			<div className="w-full flex flex-row justify-between items-center mb-6 mt-4 px-2">
				<Link href={`/${user.address}`} target="_blank">
					<div className="flex flex-row items-center">
						<Avatar user={user} />
						<span className="ml-2 cursor-pointer">{user.name || smallWalletAddress(user.address)}</span>
					</div>
				</Link>
				<div className="flex flex-row">
					<div className="flex flex-row">
						<ChartBarSquareIcon className="w-6 mr-2 text-gray-500" />
						<span>
							{user.trades} {user.trades === 1 ? 'Trade' : 'Trades'}
						</span>
					</div>
					<div className="flex flex-row ml-4 hidden">
						<StarIcon className="w-6 mr-2 text-yellow-400" />
						<span> 4.5 </span>
					</div>
				</div>
			</div>
			<div className="flex flex-col bg-gray-100 rounded-lg p-6">
				<div className="w-full flex flex-row justify-between mb-4">
					<div className="text-sm">Total available amount</div>
					<div className="font-bold text-right text-sm">
						{totalAvailableAmount} {token.symbol}{' '}
						{!!price && `(${currency.symbol} ${(Number(totalAvailableAmount) * price).toFixed(2)})`}
					</div>
				</div>
				<div className="w-full flex flex-row justify-between">
					<div className="w-full flex flex-row mb-4 space-x-2">
						<div className="text-sm">Price</div>
						<div className="font-bold text-right text-sm">
							{currency.symbol} {Number(price).toFixed(2)}
						</div>
					</div>
					{/*<div className="w-full flex flex-row mb-4">
						<div className="text-sm">Payment Limit</div>
						<div className="text-sm font-bold">10 minutes</div>
					</div> */}
				</div>

				<div className="w-full flex flex-row justify-between">
					{!!fiatAmount && (
						<div className="flex flex-row space-x-2 mb-4">
							<div className="text-sm">Amount to pay</div>
							<div className="font-bold text-sm">
								{currency.symbol} {Number(fiatAmount).toFixed(2)}
							</div>
						</div>
					)}
					{!!tokenAmount && (
						<div className="flex flex-row space-x-2 mb-4">
							<div className="text-sm">Amount to receive</div>
							<div className="font-bold text-sm">
								{Number(tokenAmount)?.toFixed(2)} {token.symbol}
							</div>
						</div>
					)}
				</div>
				<div className="w-full flex flex-row justify-between">
					{!!limitMin && (
						<div className="flex flex-row space-x-2 mb-4">
							<div className="text-sm">Min order</div>
							<div className="font-bold text-right text-sm">
								{currency.symbol} {limitMin}
							</div>
						</div>
					)}
					{!!limitMax && (
						<div className="flex flex-row space-x-2 mb-4">
							<div className="text-sm">Max order</div>
							<div className="font-bold text-right text-sm">
								{currency.symbol} {limitMax}
							</div>
						</div>
					)}
				</div>
				{paymentMethod.bank && (
					<div className="w-full flex flex-row mb-4 space-x-2">
						<div className="text-sm">Payment method</div>
						<div className="flex flex-row items-center font-bold">
							<Image
								src={paymentMethod.bank.icon}
								alt={paymentMethod.bank.name}
								className="h-6 w-6 flex-shrink-0 rounded-full mr-1"
								width={24}
								height={24}
								unoptimized
							/>
							{paymentMethod?.bank?.name}
						</div>
					</div>
				)}
				{!!terms && (
					<div className="w-full flex flex-row mb-4 space-x-2">
						<div className="text-sm">Terms</div>
						<div className="text-sm font-bold">{terms}</div>
					</div>
				)}
			</div>

			<div className="mt-6">
				<span className="text-gray-800 text-sm font-bold">Merchant&apos;s Note</span>
				<p className="mt-2 text-sm text-gray-500">
					Please do not include any crypto related keywords like {token.symbol} or OpenPeer. Thanks for doing
					business with me.
				</p>
			</div>
			{!!chatAddress && <Chat address={chatAddress} label={selling ? 'buyer' : 'merchant'} />}
			<div className="bg-[#FEFAF5] text-[#E37A00] p-4 rounded">
				<p className="text-sm font-bold mb-2">Disclaimer</p>
				<p className="text-sm">
					Trades settled outside of OpenPeer cannot have funds escrowed and can&apos;t be disputed. You should
					only trade with merchants through OpenPeer.
				</p>
			</div>
		</div>
	);
};

export default SummaryBuy;
