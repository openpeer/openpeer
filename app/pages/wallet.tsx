import { useDynamicContext, useSendBalance } from '@dynamic-labs/sdk-react';
import { u } from '@wagmi/core/dist/index-35b6525c';
import { Button, Loading, Token as TokenImage } from 'components';
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

		setToken(undefined);
		setHash(
			await walletClient.writeContract({
				address: token.address,
				abi: erc20ABI,
				functionName: 'transfer',
				chain,
				args: [address, parseUnits(amount.toString(), token.decimals)]
			})
		);
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
				<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
					<table className="w-full md:rounded-lg overflow-hidden">
						<thead className="bg-gray-100">
							<tr className="w-full">
								<th
									scope="col"
									className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
								>
									Coins
								</th>
								<th
									scope="col"
									className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
								>
									Assets Balance
								</th>
								<th
									scope="col"
									className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
								>
									Action
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 bg-white">
							{tokens.map((t) => {
								const { id, name, address, decimals, symbol } = t;
								const balance = balances[address];
								return (
									<tr key={id} className="hover:bg-gray-50">
										<td className="px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
											<div className="flex flex-row items-center space-x-2">
												<div>
													<TokenImage token={t} size={32} />
												</div>
												<div className="flex flex-col">
													<span className="text-base font-semibold text-gray-900">
														{name}
													</span>
													<div>{symbol}</div>
												</div>
											</div>
										</td>
										<td className="px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
											{balance === undefined ? (
												<Loading big={false} message="" row={false} />
											) : (
												`${formatUnits(balance, decimals)} ${symbol}`
											)}
										</td>
										<td className="px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
											<div>
												{(balance || BigInt(0)) > BigInt(0) && (
													<Button
														title="Send"
														onClick={address === zeroAddress ? open : () => setToken(t)}
													/>
												)}
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
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
