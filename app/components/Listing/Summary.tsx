import Flag from 'components/Flag/Flag';
import Token from 'components/Token/Token';
import { countries } from 'models/countries';
import { FiatCurrency, PaymentMethod, Token as TokenModel } from 'models/types';
import Image from 'next/image';

import coins from './coins.svg';
import { UIList } from './Listing.types';

interface SummaryProps {
	list: UIList;
}

const Summary = ({ list }: SummaryProps) => {
	const { token, currency, totalAvailableAmount, limitMin, limitMax, marginType, margin, paymentMethod, terms } =
		list;
	const currencySymbol = (currency as FiatCurrency)?.symbol;

	if (!token && !currency) {
		return <Image src={coins} alt="coins image" width={441} height={385} />;
	}

	return (
		<div className="w-2/4 hidden md:inline-block bg-white rounded-xl border-2 border-slate-100 overflow-hidden shadow-sm md:ml-16 md:px-8 md:py-6 p-4">
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
						<div>Total Available</div>
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
								? `${currencySymbol} ${margin.toFixed(2)} per ${token?.name}`
								: `Spot price ${margin > 0 ? '+' : '-'} ${Math.abs(margin).toFixed(2)}%`}
						</div>
					</li>
				)}
				<div className="mt-6 mb-6 border-b-2 border-dashed border-color-gray-400"></div>
				{!!paymentMethod && (
					<li className="w-full flex flex-row justify-between mb-4">
						<div>Payment Method</div>
						<div className="w-2/4 flex flex-col bg-gray-50 border-cyan-200 rounded p-4">
							{!!paymentMethod.bank && (
								<>
									<div className="flex flex-row items-center text-gray-500 text-sm mb-2">
										<Image
											src={paymentMethod.bank.icon}
											alt={paymentMethod.bank.name}
											className="h-6 w-6 flex-shrink-0 rounded-full mr-1"
											width={24}
											height={24}
										/>
										{paymentMethod.bank.name}
									</div>
									{Object.keys(paymentMethod.values || {}).map((key) => {
										const {
											bank: { account_info_schema: schema }
										} = paymentMethod as PaymentMethod;
										const field = schema.find(({ id }) => id === key);
										const value = (paymentMethod.values || {})[key];
										if (!value) return <></>;

										return (
											<div className="mb-2 flex flex-row items-center" key={key}>
												<span className="mr-2">{field?.label}:</span>
												<div className="flex flex-row justify-between">
													<span>{value}</span>
												</div>
											</div>
										);
									})}
								</>
							)}
						</div>
					</li>
				)}
				{!!terms && (
					<li className="w-full flex flex-row justify-between mb-4">
						<div>Terms</div>
						<div className="font-bold">{terms}</div>
					</li>
				)}
			</ul>
		</div>
	);
};

export default Summary;
