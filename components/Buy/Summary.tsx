/* eslint-disable @typescript-eslint/indent */
import Avatar from 'components/Avatar';
import Link from 'next/link';
import React from 'react';
import { smallWalletAddress } from 'utils';
import { useAccount } from 'hooks';

import { ChartBarSquareIcon, StarIcon } from '@heroicons/react/24/outline';

import { UIOrder } from './Buy.types';
import Chat from './Chat';

const SummaryBuy = ({ order }: { order: UIOrder }) => {
	const {
		list,
		price,
		fiat_amount: fiatAmount,
		token_amount: tokenAmount,
		buyer,
		id,
		payment_method: paymentMethod
	} = order;
	const {
		fiat_currency: currency,
		limit_min: limitMin,
		limit_max: limitMax,
		token,
		total_available_amount: totalAvailableAmount,
		terms,
		type,
		accept_only_verified: acceptOnlyVerified,
		escrow_type: escrowType,
		payment_methods: paymentMethods
	} = list!;

	const { address } = useAccount();
	const seller = order.seller || list.seller;
	const selling = seller.address === address;
	const chatAddress = selling ? buyer.address : seller.address;
	const user = !!selling && !!buyer ? buyer : seller;
	const banks = paymentMethod
		? [paymentMethod.bank]
		: type === 'BuyList'
		? list.banks
		: paymentMethods.map((pm) => pm.bank);
	const depositTimeLimit = order.deposit_time_limit || list.deposit_time_limit;
	const paymentTimeLimit = order.payment_time_limit || list.payment_time_limit;
	const instantEscrow = escrowType === 'instant';

	return (
		<div className="hidden lg:contents">
			<div className="w-full lg:w-2/4 lg:inline-block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm md:ml-16 md:px-8 md:py-4 p-4">
				<div className="w-full flex flex-row justify-between items-center mb-6 mt-4 px-2">
					<Link href={`/${user.address}`} target="_blank">
						<div className="flex flex-row items-center">
							<Avatar user={user} className="w-10 aspect-square" />
							<span className="ml-2 cursor-pointer">{user.name || smallWalletAddress(user.address)}</span>
							{user.online !== null && (
								<div className="pl-1 md:pl-2 text-sm">
									{user.online ? (
										<div className="flex flex-row items-center space-x-1">
											<div className="w-2 h-2 bg-green-500 rounded-full" />
											<span className="text-green-500 text-xs">Online</span>
										</div>
									) : (
										<div className="flex flex-row items-center space-x-1">
											<div className="w-2 h-2 bg-orange-500 rounded-full" />
											<span className="text-orange-500 text-xs">Not online</span>
										</div>
									)}
								</div>
							)}
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
					<div className="w-full flex flex-col md:flex-row justify-between mb-4">
						<div className="text-sm">Total available amount</div>
						<div className="font-bold md:text-right text-sm">
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
						{/* <div className="w-full flex flex-row mb-4">
						<div className="text-sm">Payment Limit</div>
						<div className="text-sm font-bold">10 minutes</div>
					</div> */}
					</div>

					<div className="w-full flex flex-row justify-between">
						{!!fiatAmount && (
							<div className="flex flex-row space-x-2 mb-4">
								<div className="text-sm">Amount to pay</div>
								<div className="font-bold text-sm">
									{selling
										? `${tokenAmount} ${token.symbol}`
										: `${currency.symbol} ${Number(fiatAmount).toFixed(2)}`}
								</div>
							</div>
						)}
						{!!tokenAmount && (
							<div className="flex flex-row space-x-2 mb-4">
								<div className="text-sm">Amount to receive</div>
								<div className="font-bold text-sm">
									{selling
										? `${currency.symbol} ${Number(fiatAmount).toFixed(2)}`
										: `${tokenAmount} ${token.symbol}`}
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
					{banks.length > 0 && (
						<div className="w-full flex flex-row mb-4 space-x-2">
							<div className="text-sm">Payment methods</div>
							{banks.map((bank) => (
								<div className="flex flex-row items-center" key={bank.id}>
									<span
										className="bg-gray-500 w-1 h-3 rounded-full"
										style={{ backgroundColor: bank.color || 'gray' }}
									>
										&nbsp;
									</span>
									<span className="pl-1 text-gray-700 text-[11px]">{bank.name}</span>
								</div>
							))}
						</div>
					)}
					{instantEscrow ? (
						<div className="w-full flex flex-row mb-4 space-x-2">
							<div className="text-sm font-bold">⚡ Instant deposit</div>
						</div>
					) : (
						!!depositTimeLimit && (
							<div className="w-full flex flex-row mb-4 space-x-2">
								<div className="text-sm">Deposit Time Limit</div>
								<div className="text-sm font-bold">
									{depositTimeLimit} {depositTimeLimit === 1 ? 'minute' : 'minutes'}
								</div>
							</div>
						)
					)}
					{!!paymentTimeLimit && (
						<div className="w-full flex flex-row mb-4 space-x-2">
							<div className="text-sm">Payment Time Limit</div>
							<div className="text-sm font-bold">
								{paymentTimeLimit} {paymentTimeLimit === 1 ? 'minute' : 'minutes'}
							</div>
						</div>
					)}
					{!!terms && (
						<div className="w-full flex flex-row mb-4 space-x-2">
							<div className="text-sm">Terms</div>
							<div className="text-sm font-bold">{terms}</div>
						</div>
					)}
					{!!acceptOnlyVerified && (
						<div className="w-full flex flex-row mb-4 space-x-2">
							<div className="text-sm">
								Accept only verified {type === 'SellList' ? 'buyers' : 'sellers'}
							</div>
							<div className="text-sm font-bold">{terms}</div>
						</div>
					)}
				</div>

				<div className="mt-6">
					<span className="text-gray-800 text-sm font-bold">Seller&apos;s Note</span>
					<p className="mt-2 text-sm text-gray-500">
						Please do not include any crypto related keywords like {token.symbol} or OpenPeer. Ensure
						you&apos;re including the reference number {id ? `(${String(Number(id) * 10000)})` : ''} on your
						transfer. Thanks for trading with me.
					</p>
				</div>
				{!!chatAddress && <Chat address={chatAddress} label={selling ? 'buyer' : 'seller'} />}
				<div className="bg-[#FEFAF5] text-[#E37A00] p-4 rounded">
					<p className="text-sm font-bold mb-2">Disclaimer</p>
					<p className="text-sm">
						Trades settled outside of OpenPeer cannot have funds escrowed and can&apos;t be disputed. You
						should only trade with sellers through OpenPeer.
					</p>
				</div>
			</div>
		</div>
	);
};

export default SummaryBuy;
