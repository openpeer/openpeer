/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/indent */
import React, { useState } from 'react';
import { Token } from 'models/types';
import { useQRCode } from 'next-qrcode';
import { allChains } from 'models/networks';
import { arbitrum, optimism } from 'wagmi/chains';
import ClipboardText from 'components/Buy/ClipboardText';
import DeploySellerContract from 'components/Buy/EscrowButton/DeploySellerContract';
import Input from 'components/Input/Input';
import ExplainerNotification from 'components/Notifications/ExplainerNotification';
import { formatUnits, parseUnits } from 'viem';
import DepositFunds from 'components/DepositButton';
import { constants } from 'ethers';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import Button from 'components/Button/Button';
import TokenImage from '../Token/Token';
import StepLayout from './StepLayout';

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
	const chainToken = chain
		? chain.id === arbitrum.id
			? { symbol: 'ARB', icon: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=026' }
			: chain.id === optimism.id
			? {
					symbol: 'OPTMISM',
					icon: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png?v=026'
			  }
			: chain.nativeCurrency
		: undefined;
	const sellerContractDeployed = !!sellerContract && sellerContract !== constants.AddressZero;
	const { switchNetwork } = useSwitchNetwork();

	const { chain: connectedChain } = useNetwork();
	const wrongChain = chainId !== connectedChain?.id;

	return (
		<StepLayout buttonText={`Deposit ${token.name}`}>
			<div className="my-4">
				<div className="text-sm bg-gray-200 rounded-lg p-4 py-3 mb-4 flex flex-row justify-between">
					<span>Balance Summary</span>
					<span>
						{formatUnits(balance, token.decimals)} {token.symbol}
					</span>
				</div>
				<h2 className="block text-xl font-medium mb-1 font-bold">
					{`${sellerContractDeployed ? 'Fund' : 'Deploy'} Escrow Contract`}
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
									Escrow Contract.
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
										disabled={(depositAmount || 0) < toDeposit || chainId !== connectedChain?.id}
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
							<h2 className="block text-xl font-medium mb-1 font-bold my-8">
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
													<TokenImage token={chainToken! as Token} size={20} />
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
