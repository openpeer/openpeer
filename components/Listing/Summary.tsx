import Flag from 'components/Flag/Flag';
import Token from 'components/Token/Token';
import { countries } from 'models/countries';
import { Bank, FiatCurrency, Token as TokenModel } from 'models/types';
import Image from 'next/image';
import React from 'react';

import coins from './post-ad.png';
import { UIList } from './Listing.types';

interface SummaryProps {
	list: UIList;
}

const Summary = ({ list }: SummaryProps) => {
	const {
		token,
		currency,
		totalAvailableAmount,
		limitMin,
		limitMax,
		marginType,
		margin,
		paymentMethods = [],
		depositTimeLimit,
		paymentTimeLimit,
		terms,
		type,
		acceptOnlyVerified,
		escrowType
	} = list;
	const currencySymbol = (currency as FiatCurrency)?.symbol;
	const instantEscrow = escrowType === 'instant';

	if (!token && !currency) {
		return (
			<div className="hidden md:block m-auto">
				<Image
					src={coins}
					alt="coins image"
					width={441}
					height={385}
					className="rounded-xl overflow-hidden md:ml-8 my-8 md:p-4 m-auto"
				/>
			</div>
		);
	}

	return (
		<div className="w-full md:w-2/4 md:inline-block bg-white rounded-xl border-2 border-slate-100 overflow-hidden shadow-sm md:ml-16 md:px-8 md:py-6 p-4">
			<ul className="w-full">
				{!!token && (
					<li className="w-full flex flex-row justify-between mb-4">
						<div>Token</div>
						<div>
							<div className="flex flex-row">
								<span>
									<Token token={token as TokenModel} size={24} />
								</span>
								<span className="font-bold ml-2"> {token.name}</span>
							</div>
						</div>
					</li>
				)}
				{!!currency && (
					<li className="w-full flex flex-row justify-between mb-4">
						<div>Fiat</div>
						<div>
							<div className="flex flex-row">
								<span>
									<Flag name={countries[currency.icon]} size={24} />
								</span>
								<span className="font-bold ml-2"> {currency.name}</span>
							</div>
						</div>
					</li>
				)}
				{!!totalAvailableAmount && (
					<li className="w-full flex flex-row justify-between mb-4">
						<div>Total Available {type === 'BuyList' && 'To Buy'} </div>
						<div className="font-bold">
							{totalAvailableAmount} {token?.name}
						</div>
					</li>
				)}
				{!!limitMin && (
					<li className="w-full flex flex-row justify-between mb-4">
						<div>Min Order</div>
						<div className="font-bold">
							{currencySymbol} {limitMin}
						</div>
					</li>
				)}
				{!!limitMax && (
					<li className="w-full flex flex-row justify-between mb-4">
						<div>Max Order</div>
						<div className="font-bold">
							{currencySymbol} {limitMax}
						</div>
					</li>
				)}
				{!!margin && (
					<li className="w-full flex flex-row justify-between mb-4 border-bottom border-dashed border-color-gray-200">
						<div>Your Price</div>
						<div className="font-bold">
							{marginType === 'fixed'
								? `${currencySymbol} ${margin.toFixed(3)} per ${token?.name}`
								: `Market price ${margin > 0 ? '+' : '-'} ${Math.abs(margin).toFixed(2)}%`}
						</div>
					</li>
				)}
				<div className="mt-6 mb-6 border-b-2 border-dashed border-color-gray-400" />
				{paymentMethods.length > 0 && (
					<li className="w-full flex flex-col md:flex-row justify-between mb-4">
						<div>Payment Methods</div>
						<div className="w-full md:w-2/4 flex flex-col bg-gray-50 border-cyan-200 rounded p-4">
							{paymentMethods.map(
								(pm) =>
									pm.bank && (
										<div className="flex flex-row items-center" key={pm.id}>
											<span
												className="bg-gray-500 w-1 h-3 rounded-full"
												style={{ backgroundColor: (pm.bank as Bank).color || 'gray' }}
											>
												&nbsp;
											</span>
											<span className="pl-1 text-gray-700 text-[11px]">{pm.bank.name}</span>
										</div>
									)
							)}
						</div>
					</li>
				)}
				{instantEscrow ? (
					<li className="w-full flex flex-row justify-between mb-4">
						<div className="font-bold">⚡ Instant deposit</div>
					</li>
				) : (
					!!depositTimeLimit && (
						<li className="w-full flex flex-row justify-between mb-4">
							<div>Deposit Time Limit</div>
							<div className="font-bold">
								{depositTimeLimit} {depositTimeLimit === 1 ? 'minute' : 'minutes'}{' '}
							</div>
						</li>
					)
				)}
				{!!paymentTimeLimit && (
					<li className="w-full flex flex-row justify-between mb-4">
						<div>Payment Time Limit</div>
						<div className="font-bold">
							{paymentTimeLimit} {paymentTimeLimit === 1 ? 'minute' : 'minutes'}{' '}
						</div>
					</li>
				)}
				{!!terms && (
					<li className="w-full flex flex-row justify-between mb-4">
						<div>Terms</div>
						<div className="font-bold">{terms}</div>
					</li>
				)}
				{!!acceptOnlyVerified && (
					<li className="w-full flex flex-row justify-between mb-4">
						<div>Accept only verified {type === 'SellList' ? 'buyers' : 'sellers'}</div>
					</li>
				)}
			</ul>
		</div>
	);
};

export default Summary;
