/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/indent */
import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Token } from 'models/types';
import { allChains } from 'models/networks';
import { useQRCode } from 'next-qrcode';
import { OpenPeerEscrow } from 'abis';
import { useContractRead, useSwitchNetwork } from 'wagmi';
import { formatUnits } from 'viem';
import { useNetwork } from 'hooks';
import ClipboardText from './Buy/ClipboardText';
import HeaderH3 from './SectionHeading/h3';
import Switcher from './Button/Switcher';
import Input from './Input/Input';
import TokenImage from './Token/Token';
import DepositFunds from './DepositButton';
import ExplainerNotification from './Notifications/ExplainerNotification';
import Button from './Button/Button';
import WithdrawFundsButton from './WithdrawButton/WithdrawFundsButton';
import Loading from './Loading/Loading';
import Network from './Network/Network';

interface EscrowDepositWithdrawProps {
	token: Token;
	contract: `0x${string}`;
	action: 'Deposit' | 'Withdraw';
	onBack: () => void;
	canDeposit: boolean;
	canWithdraw: boolean;
}

const EscrowDepositWithdraw = ({
	token,
	contract,
	action,
	onBack,
	canDeposit,
	canWithdraw
}: EscrowDepositWithdrawProps) => {
	const { SVG } = useQRCode();
	const { switchNetwork } = useSwitchNetwork();
	const { chain: connectedChain } = useNetwork();
	const wrongChain = token.chain_id !== connectedChain?.id;

	const { data } = useContractRead({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: 'balances',
		args: [token.address],
		enabled: !wrongChain,
		chainId: token.chain_id,
		watch: true
	});

	const [type, setType] = useState<'Deposit' | 'Withdraw'>(action);
	const [depositAmount, setDepositAmount] = useState<number>();

	const chain = allChains.find((c) => c.id === token.chain_id);

	const deposit = type === 'Deposit';
	const balance = data ? Number(formatUnits(data as bigint, token.decimals)) : 0;

	useEffect(() => {
		if (canDeposit && !canWithdraw) {
			setType('Deposit');
		} else if (canWithdraw && !canDeposit) {
			setType('Withdraw');
		}
	}, [canDeposit, canWithdraw]);

	if (!canDeposit && !canWithdraw) {
		return <Loading />;
	}

	return (
		<div className="px-6 w-full flex flex-col items-center mt-4 pt-4 md:pt-6 text-gray-700 relative">
			<div className="w-full lg:w-1/2 flex flex-col justify-between mb-16">
				<div className="flex flex-row space-x-4 items-center mb-2 cursor-pointer" onClick={onBack}>
					<ArrowLeftIcon className="w-4 h-4" /> <span className="text-sm">Back to Escrows</span>
				</div>
				<div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
					<HeaderH3 title={`${type} funds`} />
					{canDeposit === canWithdraw && (
						<Switcher
							leftLabel="Deposit"
							rightLabel="Withdraw"
							selected={type}
							onToggle={(t) => setType(t as 'Deposit' | 'Withdraw')}
						/>
					)}
				</div>
				<div className="flex flex-col border border-slate-300 mt-4 p-4 rounded">
					<div className="font-bold text-xl mb-2">
						{type} {token.symbol}
					</div>
					<div className="text-sm">
						<>
							{type} {token.name} {deposit ? 'into' : 'from'} your{' '}
							<a
								href={`${chain?.blockExplorers.etherscan.url}/address/${contract}`}
								className="text-cyan-600"
								target="_blank"
								rel="noreferrer"
							>
								Escrow Contract.
							</a>
						</>
						{deposit ? (
							<span>
								The amount you deposit will be available for other traders to buy. You will have to
								acknowledge receipt of funds before escrowed crypto is released on any trade.
							</span>
						) : (
							<span>You can withdraw all your avaiable funds at any time.</span>
						)}
					</div>
					<div className="flex flex-row justify-between text-sm py-4 border-b border-gray-200">
						<span>Network</span>
						<div className="flex flex-row items-center space-x-1">
							<Network id={token.chain_id} size={20} />
							<span>{chain!.name}</span>
						</div>
					</div>
					<div className="flex flex-row justify-between text-sm py-4 border-b border-gray-200">
						<span>Asset</span>
						<div className="flex flex-row items-center space-x-1">
							<TokenImage token={token} size={20} />
							<span>{token.symbol}</span>
						</div>
					</div>
					{data !== undefined && (
						<div className="flex flex-row justify-between text-sm py-4 border-b border-gray-200">
							<span>Balance</span>
							<div className="flex flex-row items-center space-x-1">
								<span className="font-bold">
									{balance} {token.symbol}
								</span>
							</div>
						</div>
					)}
					<div className="flex flex-col space-y-2 justify-center items-center mt-2">
						<div className="w-full">
							<Input
								label="Amount"
								id="depositAmount"
								type="decimal"
								placeholder="1000"
								decimalScale={token.decimals}
								value={depositAmount}
								onChangeNumber={setDepositAmount}
								containerExtraStyle="mt-0 mb-2"
							/>
							{wrongChain ? (
								<Button title={`Switch to ${chain?.name}`} onClick={() => switchNetwork?.(chain?.id)} />
							) : deposit ? (
								<DepositFunds
									contract={contract}
									token={token}
									tokenAmount={depositAmount!}
									disabled={(depositAmount || 0) <= 0}
								/>
							) : (
								<WithdrawFundsButton
									contract={contract}
									token={token}
									tokenAmount={depositAmount!}
									disabled={(depositAmount || 0) <= 0 || (depositAmount || 0) > balance}
								/>
							)}
						</div>
						<span className="text-sm text-gray-500">Available funds can be withdrawn at any time</span>
					</div>
					{deposit && (
						<div className="mt-8">
							<h2 className="block text-xl font-medium mb-1 font-bold my-8">
								{`or send ${token.symbol} from your exchange`}
							</h2>
							<div className="mt-2 mb-4 border border-gray-200 rounded-lg py-8 px-4 md:px-8  flex flex-col xl:flex-row items-center">
								<SVG
									text={contract}
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
										<ClipboardText itemValue={contract} extraStyle="break-all" />
									</div>
									<div className="text-sm font-bold">
										<ExplainerNotification
											title={
												<div className="flex flex-row space-x-2">
													<Network id={token.chain_id} size={20} />
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
		</div>
	);
};

export default EscrowDepositWithdraw;
