/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/indent */
import React from 'react';
import { Token } from 'models/types';
import Button from 'components/Button/Button';
import { useQRCode } from 'next-qrcode';
import Label from 'components/Label/Label';
import { allChains } from 'models/networks';
import { arbitrum, optimism } from 'wagmi/chains';
import ClipboardText from 'components/Buy/ClipboardText';
import { formatUnits } from 'viem';
import TokenImage from '../Token/Token';
import StepLayout from './StepLayout';
import DeploySellerContract from 'components/Buy/EscrowButton/DeploySellerContract';

interface FundsEscrowProps {
	token: Token;
	sellerContract: `0x${string}` | undefined;
	chainId: number;
	balance: bigint;
}

const FundEscrow = ({ token, sellerContract, chainId, balance }: FundsEscrowProps) => {
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

	return (
		<StepLayout buttonText={`Deposit ${token.name}`}>
			<div className="my-8">
				<div className="font-bold text-sm bg-gray-200 rounded-lg p-2 py-3 mb-2 flex flex-row justify-between">
					<span>Balance Summary</span>
					<span>
						{formatUnits(balance, token.decimals)} {token.symbol}
					</span>
				</div>
				<Label title={`${sellerContract ? 'Fund' : 'Deploy'} Escrow Contract`} extraStyle="font-bold" />
				<div className="mb-4">
					<div className="text-sm text-gray-600 mb-8">
						{sellerContract && (
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
						{sellerContract ? <Button title={`Deposit ${token.name}`} /> : <DeploySellerContract />}

						<span className="text-sm text-gray-500">Funds can be withdrawn at any time</span>
					</div>
					{sellerContract && (
						<div className="mt-8">
							<Label title={`or send ${token.symbol} from your exchange`} extraStyle="font-bold my-8" />
							<div className="mt-2 mb-4">
								<div className="border border-gray-200 rounded-lg">
									<div className="py-4 px-8 flex justify-center items-center">
										<SVG
											text={sellerContract}
											options={{
												errorCorrectionLevel: 'L',
												margin: 2,
												width: 250,
												quality: 1
											}}
											logo={{
												src: 'https://openpeerpublic.s3.us-west-1.amazonaws.com/logo/oplogo.png',
												options: {
													width: 35
												}
											}}
										/>
									</div>
									<div className="border-t border-gray-200 pt-6 px-8">
										<span className="font-bold">Send to Address</span>
										<ClipboardText itemValue={sellerContract} />
									</div>
									<div className="flex flex-row space-x-2 py-4 px-8">
										<div className="flex flex-row space-x-2">
											<TokenImage token={chainToken! as Token} size={20} />
											<span className="text-sm">{chain?.name}</span>
										</div>
										<div className="text-sm font-bold">
											Only send on the {chain?.name} network otherwise funds will be lost
										</div>
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
