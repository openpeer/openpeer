import Avatar from 'components/Avatar';
import Button from 'components/Button/Button';
import Loading from 'components/Loading/Loading';
import Image from 'next/image';
import Link from 'next/link';
import { smallWalletAddress } from 'utils';
import { useAccount } from 'wagmi';

import { ChartBarSquareIcon, ChatBubbleLeftEllipsisIcon, StarIcon } from '@heroicons/react/24/outline';

import { UIOrder } from './Buy.types';

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
	const chatAddress = selling ? seller.address : buyer?.address;
	const user = !!selling && !!buyer ? buyer : seller;

	return (
		<div className="w-2/4 hidden md:inline-block bg-white rounded-xl border-2 border-slate-100 overflow-hidden shadow-sm md:ml-16 md:px-8 md:py-4 p-4">
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
							{user.trades} {user.trades > 1 ? 'Trades' : 'Trade'}
						</span>
					</div>
					<div className="flex flex-row ml-4 hidden">
						<StarIcon className="w-6 mr-2 text-yellow-400" />
						<span> 4.5 </span>
					</div>
				</div>
			</div>
			<ul className="flex flex-col bg-gray-100 rounded-lg p-6">
				<li className="w-full flex flex-row justify-between mb-4">
					<div>Total available amount</div>
					<div className="font-bold text-right">
						{totalAvailableAmount} {token.symbol}{' '}
						{!!price && `(${currency.symbol} ${Number(totalAvailableAmount) * price})`}
					</div>
				</li>
				<li className="w-full flex flex-row justify-between mb-4">
					<div>Price</div>
					<div className="font-bold text-right">
						{currency.symbol} {Number(price).toFixed(2)}
					</div>
				</li>
				{!!fiatAmount && (
					<li className="w-full flex flex-row justify-between mb-4">
						<div>Amount to pay</div>
						<div className="font-bold">
							{currency.symbol} {Number(fiatAmount).toFixed(2)}
						</div>
					</li>
				)}
				{!!tokenAmount && (
					<li className="w-full flex flex-row justify-between mb-4">
						<div>Amount to receive</div>
						<div className="font-bold">
							{Number(tokenAmount)?.toFixed(2)} {token.symbol}
						</div>
					</li>
				)}
				{!!limitMin && (
					<li className="w-full flex flex-row justify-between mb-4">
						<div>Min order</div>
						<div className="font-bold text-right">
							{currency.symbol} {limitMin}
						</div>
					</li>
				)}
				{!!limitMax && (
					<li className="w-full flex flex-row justify-between mb-4">
						<div>Max order</div>
						<div className="font-bold text-right">
							{currency.symbol} {limitMax}
						</div>
					</li>
				)}
				{paymentMethod.bank && (
					<li className="w-full flex flex-row justify-between mb-4">
						<div>Payment method</div>
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
					</li>
				)}
				{!!terms && (
					<li className="w-full flex flex-row justify-between mb-4">
						<div>Terms</div>
						<div className="font-bold">{terms}</div>
					</li>
				)}
				{/* <li className="w-full flex flex-row justify-between mb-4">
					<div>Payment Limit</div>
					<div className="font-bold">10 minutes</div>
				</li> */}
			</ul>
			<div className="mt-6">
				<span className="text-cyan-600">Please Note</span>
				<p className="mt-2">
					Please do not include any crypto related keywords like {token.symbol} or OpenPeer. Thanks for doing
					business with me.
				</p>
				{!!chatAddress && (
					<Button
						onClick={() =>
							window.open(
								`https://chat.blockscan.com/index?a=${selling ? seller.address : buyer?.address}`,
								'_blank',
								'noreferrer'
							)
						}
						title={
							<span className="flex flex-row items-center justify-center">
								<span className="mr-2">Chat with {selling ? 'buyer' : 'merchant'}</span>
								<ChatBubbleLeftEllipsisIcon className="w-8" />
							</span>
						}
						outlined
					/>
				)}
			</div>
		</div>
	);
};

export default SummaryBuy;
