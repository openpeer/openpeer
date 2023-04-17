import Button from 'components/Button/Button';
import StepLayout from 'components/Listing/StepLayout';
import HeaderH2 from 'components/SectionHeading/h2';
import Image from 'next/image';
import { useAccount } from 'wagmi';

import { ClockIcon } from '@heroicons/react/24/outline';

import { BuyStepProps } from './Buy.types';
import CancelOrderButton from './CancelOrderButton/CancelOrderButton';
import ClipboardText from './ClipboardText';
import EscrowButton from './EscrowButton';
import MarkAsPaidButton from './MarkAsPaidButton';
import FeeDisplay from './Payment/FeeDisplay';
import PreShowDetails from './PreShowDetails';
import ReleaseFundsButton from './ReleaseFundsButton';
import upilogo from 'public/payment_channel/upiLogo.svg';

const Payment = ({ order }: BuyStepProps) => {
	const { list, fiat_amount: fiatAmount, token_amount: tokenAmount, price, uuid, buyer, escrow, id, status } = order;
	const { token, fiat_currency: currency, payment_method: paymentMethod } = list!;
	const { bank, values = {} } = paymentMethod;
	const { address } = useAccount();
	const seller = list?.seller.address === address;

	return (
		<StepLayout>
			<div className="my-8">
				{status === 'created' && (
					<div>
						<span className="flex flex-row mb-2 text-yellow-600">
							<ClockIcon className="w-8 mr-2" />
							<HeaderH2 title="Awaiting Merchant Deposit" />
						</span>
						<p className="text-base">
							{seller
								? 'Please deposit funds to escrow in order to confirm and complete this transaction.'
								: 'Kindly wait for the merchant to accept the order and escrow their funds. Payments details will become visible as soon as merchant escrow the funds. '}
						</p>
					</div>
				)}
				{status === 'escrowed' && (
					<div>
						<span className={`flex flex-row mb-2 ${!!seller && 'text-yellow-600'}`}>
							<HeaderH2 title={seller ? 'Awaiting Buyer Payment' : 'Pay Merchant'} />
						</span>
						<p className="text-base">
							{seller
								? 'Kindly wait for the buyer to pay. If the buyer already paid you can release the funds. Be careful.'
								: 'Proceed to your bank app or payment platform and send the required amount to the bank account details below.'}
						</p>
					</div>
				)}
				<div className="flex flex-row justify-around bg-gray-100 rounded-lg p-6 my-4">
					<div className="flex flex-col">
						<span className="text-sm">Amount to pay</span>
						<span className="text-lg font-medium">
							{seller
								? `${Number(tokenAmount)?.toFixed(2)} ${token.symbol}`
								: `${currency.symbol} ${Number(fiatAmount).toFixed(2)}`}
						</span>
					</div>
					{seller && <FeeDisplay escrow={escrow?.address} token={token} tokenAmount={tokenAmount} />}
					<div className="flex flex-col">
						<span className="text-sm">Price</span>
						<span className="text-lg font-medium">
							{currency.symbol} {Number(price).toFixed(2)}
						</span>
					</div>
					<div className="flex flex-col">
						<span className="text-sm">Amount to receive</span>
						<span className="text-lg font-medium">
							{seller
								? `${currency.symbol} ${Number(fiatAmount).toFixed(2)}`
								: `${Number(tokenAmount)?.toFixed(2)} ${token.symbol}`}
						</span>
					</div>
				</div>

				{/* Marquinhos: Here starts UPI QRcode  */}
				<div className="w-full bg-white rounded-lg border border-color-gray-100 p-6">
					<div className="flex flex-col items-center">
						<span className="mb-4 text-lg font-bold">Scan and Pay with your UPI App</span>
						<div className="p-4 bg-white border border-grey-100 rounded-lg mb-4">
							<svg
								width="112"
								height="113"
								viewBox="0 0 112 113"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M35.6364 0H0V35.7206H35.6364V0ZM30.5455 30.6177H5.09091V5.10295H30.5455V30.6177Z"
									fill="#23262F"
								/>
								<path d="M73.8184 102.06H68.7275V112.265H112V107.163H73.8184V102.06Z" fill="#23262F" />
								<path d="M25.4544 10.2061H10.1816V25.5149H25.4544V10.2061Z" fill="#23262F" />
								<path
									d="M0 112.265H35.6364V76.5439H0V112.265ZM5.09091 81.6469H30.5455V107.162H5.09091V81.6469Z"
									fill="#23262F"
								/>
								<path d="M25.4544 86.75H10.1816V102.059H25.4544V86.75Z" fill="#23262F" />
								<path
									d="M76.3643 0V35.7206H112.001V0H76.3643ZM106.91 30.6177H81.4552V5.10295H106.91V30.6177Z"
									fill="#23262F"
								/>
								<path d="M101.819 10.2061H86.5459V25.5149H101.819V10.2061Z" fill="#23262F" />
								<path d="M112 40.8232H101.818V51.0291H112V40.8232Z" fill="#23262F" />
								<path d="M10.1818 61.2354H0V71.4412H10.1818V61.2354Z" fill="#23262F" />
								<path
									d="M53.4545 40.8236H33.0908V45.9265H58.5454V35.7206V30.6177H63.6363V20.4118H58.5454H53.4545H48.3636V10.2059H53.4545V15.3088H71.2727V0H66.1817V10.2059H58.5454V0H55.9999H45.8181H43.2726V25.5147H53.4545V30.6177H43.2726V35.7206H53.4545V40.8236Z"
									fill="#23262F"
								/>
								<path
									d="M7.63637 56.1321H17.8182H22.9091H25.4546V61.235H15.2727V66.338H25.4546V71.4409H45.8182V66.338H30.5455V61.235V51.0291H22.9091V43.3747H17.8182V51.0291H12.7273V40.8232H0V45.9262H7.63637V56.1321Z"
									fill="#23262F"
								/>
								<path
									d="M56.0003 102.06V89.3026H45.8185V79.0967H40.7275V94.4055H50.9094V102.06H40.7275V107.163H50.9094V112.266H63.6366V107.163H56.0003V102.06Z"
									fill="#23262F"
								/>
								<path
									d="M81.4544 51.0298H71.2726V38.2725H66.1816V56.1328H91.6362V51.0298H86.5453V45.9269H94.1817V40.8239H86.5453H81.4544H76.3635V45.9269H81.4544V51.0298Z"
									fill="#23262F"
								/>
								<path
									d="M76.3635 96.9558H83.9998V102.059H94.1817V96.9558V91.8529V84.1984H83.9998V91.8529H76.3635V84.1984H71.2726V91.8529H66.1817V71.4411H61.0907V66.3381H55.9998V51.0293H38.1816V61.2352H43.2726V56.1322H50.9089V66.3381V76.544H61.0907V91.8529V96.9558H66.1817H71.2726H76.3635Z"
									fill="#23262F"
								/>
								<path
									d="M106.909 63.7863H99.2725H94.1816H81.4543V73.9921H76.3634V63.7863H71.2725V79.0951H86.5452V68.8892H94.1816V76.5436H99.2725V68.8892H106.909V84.198H99.2725V99.5069H112V94.4039H104.363V89.301H112V68.8892V63.7863V56.1318H106.909V63.7863Z"
									fill="#23262F"
								/>
							</svg>
						</div>
						<div className="mb-4">merchant@icici</div>
						<div className="mb-4 flex flex-col items-center">
							<span className="text-xs text-stale-500">Powered by UPI</span>
							<Image src={upilogo} alt="UPI logo" width={100} height={35} />
						</div>
					</div>
				</div>
				{/* Here ends UPI QRcode  */}

				{status === 'created' && !seller && <PreShowDetails />}
				{status === 'escrowed' && (
					<div className="w-full bg-white rounded-lg border border-color-gray-100 p-6">
						<div className="flex flex-row justify-between mb-4">
							<span className="text-neutral-500">Payment Method</span>
							<span className="flex flex-row justify-between">
								<Image
									src={bank.icon}
									alt={bank.name}
									className="h-6 w-6 flex-shrink-0 rounded-full mr-1"
									width={24}
									height={24}
								/>
								<ClipboardText itemValue={bank.name} />
							</span>
						</div>

						{Object.keys(values || {}).map((key) => {
							const {
								bank: { account_info_schema: schema }
							} = paymentMethod;
							const field = schema.find(({ id }) => id === key);
							const value = (values || {})[key];
							if (!value) return <></>;

							return (
								<div className="flex flex-row justify-between mb-4" key={key}>
									<span className="text-neutral-500">{field?.label}</span>
									<ClipboardText itemValue={value} />
								</div>
							);
						})}
						<div className="flex flex-row justify-between">
							<span className="text-neutral-500">Reference No.</span>
							<span className="flex flex-row justify-between">
								<ClipboardText itemValue={String(Number(id) * 10000)} />
							</span>
						</div>
						<div className="border-b-2 border-dashed border-color-gray-400 mb-4 hidden"></div>
						<div className="flex flex-row justify-between hidden">
							<span className="text-neutral-500">Payment will expire in </span>
							<span className="flex flex-row justify-between">
								<span className="text-cyan-600">15m:20secs</span>
							</span>
						</div>
					</div>
				)}

				<div className="flex flex-col flex-col-reverse md:flex-row items-center justify-between mt-8 md:mt-0">
					<span className="w-full md:w-1/2 md:pr-8">
						<CancelOrderButton order={order} />
					</span>
					{status === 'created' && seller && (
						<EscrowButton
							buyer={buyer!.address}
							token={token}
							tokenAmount={tokenAmount || 0}
							uuid={uuid!}
						/>
					)}
					{status === 'escrowed' &&
						!!escrow &&
						(seller ? (
							<ReleaseFundsButton escrow={escrow.address} dispute={false} />
						) : (
							<MarkAsPaidButton escrowAddress={escrow.address} />
						))}
				</div>
			</div>
		</StepLayout>
	);
};

export default Payment;
