import { useDynamicContext, useSendBalance } from '@dynamic-labs/sdk-react';
import { WalletIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { Button, Loading, Token as TokenImage } from 'components';
import ModalWindow from 'components/Modal/ModalWindow';
import SendFundsModal from 'components/Modal/SendFundsModal';
import TransactionLink from 'components/TransactionLink';
import { useTransactionFeedback } from 'hooks';
import { Token } from 'models/types';
import React, { useEffect, useState } from 'react';
import { formatUnits, parseUnits, zeroAddress } from 'viem';
import { erc20ABI, useNetwork, usePublicClient, useWalletClient } from 'wagmi';

interface Balance {
	[key: string]: bigint;
}

const Wallet = () => {
	const { chain } = useNetwork();
	const [tokens, setTokens] = useState<Token[]>();
	const [token, setToken] = useState<Token>();
	const [hash, setHash] = useState<`0x${string}`>();
	const publicClient = usePublicClient({ chainId: chain?.id });
	const { data: walletClient } = useWalletClient({ chainId: chain?.id });
	const [balances, setBalances] = useState<Balance>({});
	const { primaryWallet } = useDynamicContext();
	const { open } = useSendBalance();

	useTransactionFeedback({
		hash,
		isSuccess: !!hash,
		Link: <TransactionLink hash={hash} />,
		description: 'Sending token'
	});

	const onSend = async (address: `0x${string}`, amount: number) => {
		if (!token || !primaryWallet || !address || amount <= 0 || !chain || !walletClient) return;
		const isNativeToken = token.address === zeroAddress;

		setToken(undefined);
		if (isNativeToken) {
			setHash(
				await walletClient.sendTransaction({
					account: primaryWallet.address as `0x${string}`,
					to: address,
					chain,
					value: parseUnits(amount.toString(), token.decimals)
				})
			);
		} else {
			setHash(
				await walletClient.writeContract({
					address: token.address,
					abi: erc20ABI,
					functionName: 'transfer',
					chain,
					args: [address, parseUnits(amount.toString(), token.decimals)]
				})
			);
		}
	};

	useEffect(() => {
		const fetchTokens = async () => {
			if (!chain) return;

			const res = await fetch(`/api/tokens?chain_id=${chain.id}`);
			const data = await res.json();
			setTokens(data);
		};
		setBalances({});
		fetchTokens();
	}, [chain]);

	useEffect(() => {
		const fetchTokensBalances = async () => {
			if (!tokens || !tokens.length || !primaryWallet) return;

			tokens.forEach(async ({ address, decimals }) => {
				let balance = BigInt(0);
				if (address === zeroAddress) {
					if (primaryWallet) {
						const value = await primaryWallet.connector.getBalance();
						balance = parseUnits(value || '0', decimals);
					}
				} else {
					balance = await publicClient.readContract({
						address,
						abi: erc20ABI,
						functionName: 'balanceOf',
						args: [primaryWallet.address as `0x${string}`]
					});
				}
				setBalances((prev) => ({ ...prev, [address]: balance }));
			});
		};
		fetchTokensBalances();
	}, [tokens]);

	useEffect(() => {
		setHash(undefined);
	}, [token]);

	if (tokens === undefined) {
		return <Loading />;
	}

	return (
		<>
			<div className="mt-8">
				<div className="w-full m-auto px-4 lg:w-2/4">
					<div className="flex flex-row items-center justify-between mb-2">
						<h2 className="text-2xl font-bold">My assets</h2>
						<div className="flex flex-row items-center space-x-2 text-gray-600 md:hidden">
							<WalletIcon width="16" height="16" />
							<span>Wallet</span>
						</div>
					</div>
					<div className="flex flex-col">
						<div>
							{tokens.map((t) => {
								const { id, name, address, decimals, symbol } = t;
								const balance = balances[address];
								return (
									<div key={id} className="py-4 my-4 border-b border-gray-200">
										<div className="flex flex-row justify-between">
											<div className="flex flex-row space-x-2 items-center">
												<TokenImage token={t} size={32} />
												<div>{name}</div>
												{/* <div>{symbol}</div> */}
											</div>
											<div className=" flex flex-row items-center space-x-2 bg-gray-100 px-2 rounded-full">
												<TokenImage token={t} size={16} />
												<span className="text-sm">{chain?.name}</span>
											</div>
										</div>
										<div className="flex flex-col py-2 mt-4">
											<span className="font-bold text-base">Balance</span>
											<span className="text-base">
												{balance === undefined ? (
													<Loading big={false} message="" row={false} />
												) : (
													`${formatUnits(balance, decimals)} ${symbol}`
												)}
											</span>
										</div>
										<div>
											{(balance || BigInt(0)) > BigInt(0) && (
												<>
													{/* <div className="hidden md:block flex justify-center">
														<Button
															title="Send"
															onClick={
																address === zeroAddress &&
																primaryWallet?.connector?.canConnectViaEmail
																	? open
																	: () => setToken(t)
															}
														/>
													</div> */}
													<div className="w-full flex flex-row justify-center items-center space-x-2">
														<Button outlined title="Buy" />
														<Button outlined title="Sell" />
														<div
															className="bg-cyan-600 rounded cursor-pointer flex flex-row items-center justify-center px-4 py-3"
															// @ts-expect-error
															onClick={
																address === zeroAddress &&
																primaryWallet?.connector?.canConnectViaEmail
																	? open
																	: () => setToken(t)
															}
														>
															<span className="text-white text-base">Send/Receive</span>
															<ArrowsUpDownIcon width={20} height={20} color="white" />
														</div>
													</div>
												</>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
			<SendFundsModal
				open={!!token}
				onClose={() => setToken(undefined)}
				token={token!}
				balance={token ? balances[token.address] || BigInt(0) : BigInt(0)}
				onSend={onSend}
			/>
		</>
	);
};

export async function getServerSideProps() {
	return {
		props: { title: 'Wallet' } // will be passed to the page component as props
	};
}
export default Wallet;
