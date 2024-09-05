import React, { useState } from 'react';
import { Token } from 'models/types';
import { useQRCode } from 'next-qrcode';
import { allChains } from 'models/networks';
import ClipboardText from 'components/Buy/ClipboardText';
import DeploySellerContract from 'components/Buy/EscrowButton/DeploySellerContract';
import Input from 'components/Input/Input';
import ExplainerNotification from 'components/Notifications/ExplainerNotification';
import { formatUnits, parseUnits } from 'viem';
import DepositFunds from 'components/DepositButton';
import { constants } from 'ethers';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import Button from 'components/Button/Button';
import Network from 'components/Network/Network';
import StepLayout from './StepLayout';
import HeaderH3 from 'components/SectionHeading/h3';
import { toast } from 'react-toastify';
import { useAccount, useBalance } from 'wagmi';

interface FundsEscrowProps {
	token: Token;
	sellerContract: `0x${string}` | undefined;
	chainId: number;
	balance: bigint;
	totalAvailableAmount: number;
}

const FundEscrow = ({ token, sellerContract, chainId, balance, totalAvailableAmount }: FundsEscrowProps) => {
	const listTotal = parseUnits(totalAvailableAmount.toString(), token.decimals);
	const listTotalNumber = Number(formatUnits(listTotal - balance, token.decimals));
	const toDeposit = listTotalNumber / 4;
	const [depositAmount, setDepositAmount] = useState<number | undefined>(listTotalNumber);
	const { SVG } = useQRCode();
	const chain = allChains.find((c) => c.id === chainId);
	const sellerContractDeployed = !!sellerContract && sellerContract !== constants.AddressZero;
	const { switchNetwork } = useSwitchNetwork();

	const { chain: connectedChain } = useNetwork();
	const wrongChain = chainId !== connectedChain?.id;

	const { address } = useAccount();
	const { data: balanceData } = useBalance({ address }); // Fetch wallet balance

	const handleCopyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success('Copied to clipboard', {
			theme: 'dark',
			position: 'top-right',
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: false,
			progress: undefined
		});
	};

	return (
		<StepLayout buttonText={`Deposit ${token.name}`}>
			<div className="my-4">
				<div className="text-sm bg-gray-200 rounded-lg p-4 py-3 mb-4 flex flex-row justify-between">
					<span>Balance Summary</span>
					<span>
						{formatUnits(balance, token.decimals)} {token.symbol}
					</span>
				</div>
				<h2 className="block text-xl mb-1 font-bold">
					{`${sellerContractDeployed ? 'Fund' : 'Create'} Escrow Account`}
				</h2>
				<div className="mb-4">
					<div className="text-sm text-gray-600 mb-4">
						{sellerContractDeployed && (
							<>
								Deposit {token.name} into your{' '}
								<a
									href={`${chain?.blockExplorers.etherscan.url}/address/${sellerContract}`}
									className="text-cyan-600"
									target="_blank"
									rel="noreferrer"
								>
									Escrow Account.
								</a>
							</>
						)}
						The amount you deposit will be available for other traders to buy. You will have to acknowledge
						receipt of funds before escrowed crypto is released on any trade.
					</div>

					<div className="flex flex-col space-y-2 justify-center items-center">
						{sellerContractDeployed ? (
							<div className="w-full">
								<Input
									label="Amount"
									id="depositAmount"
									type="decimal"
									placeholder="0.0"
									decimalScale={token.decimals}
									value={depositAmount}
									onChangeNumber={setDepositAmount}
									containerExtraStyle="mt-0 mb-2"
								/>
								{wrongChain ? (
									<Button
										title={`Switch to ${chain?.name}`}
										onClick={() => switchNetwork?.(chain?.id)}
									/>
								) : (
									<DepositFunds
										contract={sellerContract}
										token={token}
										tokenAmount={depositAmount!}
										disabled={(depositAmount || 0) < toDeposit || wrongChain}
									/>
								)}
							</div>
						) : wrongChain ? (
							<Button title={`Switch to ${chain?.name}`} onClick={() => switchNetwork?.(chain?.id)} />
						) : (
							<DeploySellerContract />
						)}
						<span className="text-sm text-gray-500">Available funds can be withdrawn at any time</span>
					</div>
					{sellerContractDeployed && (
						<div className="mt-8">
							{/* Add wallet balance and address display */}
							<div className="my-4">
								<HeaderH3 title="Need to Top Up Your Wallet?" />
								<div className="flex items-center">
									<p className="text-base">
										<strong>Your Wallet Address:</strong> {address}
									</p>
									<button
										className="ml-2"
										onClick={() => {
											if (address) {
												handleCopyToClipboard(address);
											} else {
												toast.error('Address is not available');
											}
										}}
									>
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
											/>
										</svg>
									</button>
								</div>
								<p className="text-base">
									<strong>Your Wallet Balance:</strong> {balanceData?.formatted} {balanceData?.symbol}
								</p>
							</div>
							<h2 className="block text-xl mb-1 font-bold my-8">
								{`or send ${token.symbol} from your exchange`}
							</h2>
							<div className="mt-2 mb-4 border border-gray-200 rounded-lg py-8 px-4 md:px-8  flex flex-col xl:flex-row items-center">
								<SVG
									text={sellerContract}
									options={{
										errorCorrectionLevel: 'L',
										margin: 0,
										width: 200,
										quality: 1
									}}
								/>
								<div className="p-4">
									<div className="mb-4">
										<span className="font-bold">Send to Address</span>
										<ClipboardText itemValue={sellerContract} extraStyle="break-all" />
									</div>
									<div className="text-sm font-bold">
										<ExplainerNotification
											title={
												<div className="flex flex-row space-x-2">
													<Network id={chainId} size={20} />
													<span className="text-sm">{chain?.name}</span>
												</div>
											}
											content={`Only send on the ${chain?.name} network otherwise funds will be lost`}
											disclaimer
										/>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</StepLayout>
	);
};

export default FundEscrow;
