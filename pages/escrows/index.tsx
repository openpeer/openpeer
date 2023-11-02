import { OpenPeerDeployer } from 'abis';
import { Button, Token as TokenImage } from 'components';
import HeaderH3 from 'components/SectionHeading/h2';
import NetworkSelect from 'components/Select/NetworkSelect';
import { constants } from 'ethers';
import { useAccount, useUserProfile } from 'hooks';
import { DEPLOYER_CONTRACTS } from 'models/networks';
import { Token } from 'models/types';
import React, { useEffect, useState } from 'react';
import { Chain, useBalance, useContractRead, useNetwork } from 'wagmi';

const TokenRow = ({ token, deployer }: { token: Token; deployer: `0x${string}` }) => {
	const { address } = useAccount();
	const nativeToken = token.address === constants.AddressZero;
	const { data } = useBalance({
		address: deployer,
		token: nativeToken ? undefined : token.address,
		enabled: !!address,
		chainId: token.chain_id,
		watch: true
	});

	return (
		<tr className="hover:bg-gray-50">
			<div className="mt-2 flex flex-col text-gray-500 lg:hidden">
				<div className="fw-full lex flex-col space-y-4">
					<span className="pr-2 text-sm">Token</span>
					<span>Balance</span>
					<span className="w-full flex flex-col space-y-4">
						<Button title="Deposit" />
						<Button title="Withdraw" />
					</span>
				</div>
			</div>
			<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
				<div className="flex flex-row items-center space-x-1">
					<TokenImage size={24} token={token} />
					<span>{token.symbol}</span>
				</div>
			</td>
			<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
				{data ? `${data.formatted} ${token.symbol}` : ''}
			</td>
			<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
				<div className="w-full flex flex-row space-x-4">
					<Button title="Deposit" />
					<Button title="Withdraw" />
				</div>
			</td>
		</tr>
	);
};

const MyEscrows = () => {
	const { address } = useAccount();
	const { chain: connectedChain } = useNetwork();
	const [chain, setChain] = useState<Chain>();
	const { user } = useUserProfile({});
	const [lastVersion, setLastVersion] = useState(0);
	const [tokens, setTokens] = useState<Token[]>([]);
	const deployer = DEPLOYER_CONTRACTS[chain?.id || 0];

	const { data: sellerContract } = useContractRead({
		address: deployer,
		abi: OpenPeerDeployer,
		functionName: 'sellerContracts',
		args: [address],
		enabled: !!chain,
		watch: true,
		chainId: chain?.id
	});

	useEffect(() => {
		if (connectedChain && !chain) {
			setChain({
				...connectedChain,
				// @ts-expect-error
				symbol: connectedChain.nativeCurrency.symbol
			});
		}
	}, [connectedChain]);

	useEffect(() => {
		const fetchTokens = async () => {
			if (!chain) {
				setTokens([]);
				return;
			}

			const response = await fetch(`/api/tokens?chain_id=${chain.id}`);
			setTokens(await response.json());
		};

		fetchTokens();
	}, [chain]);

	useEffect(() => {
		const fetchSettings = async () => {
			const response = await fetch('/api/settings');
			const settings: { [key: string]: string } = await response.json();
			setLastVersion(Number(settings.contract_version || 0));
		};
		fetchSettings();
	}, []);

	const contracts = (user?.contracts || []).filter((c) => c.chain_id === chain?.id);
	const lastDeployedVersion = contracts.reduce((acc, c) => Math.max(acc, Number(c.version)), 0);
	const needToDeploy = lastDeployedVersion < lastVersion || contracts.length === 0;
	const lastDeployedContract = sellerContract as `0x${string}` | undefined;

	return (
		<div className="px-6 w-full flex flex-col items-center justify-center mt-4 pt-4 md:pt-6 text-gray-700">
			<div className="w-full lg:w-1/2 flex flex-col mb-16">
				<HeaderH3 title="Deposit or Withdraw funds" />
				<div className="border border-slate-300 mt-4 p-4 rounded">
					<span>Begin by selecting the chain</span>
					<div className="w-fit">
						<NetworkSelect onSelect={setChain} selected={chain} />
					</div>
					<div>
						{contracts.length > 0 && lastDeployedVersion < lastVersion && (
							<span>
								A new version of OpenPeer is available. Please withdraw your assets and deploy a new
								escrow contract
							</span>
						)}
						{needToDeploy && (
							<div className="mt-4 mb-4">
								<Button title="Deploy a new contract" />
							</div>
						)}
					</div>
					{!!user &&
						contracts.length > 0 &&
						contracts.map((contract) => (
							<div className="mt-4" key={contract.id}>
								<a
									href={`${connectedChain?.blockExplorers?.etherscan?.url}/address/${contract.address}`}
									className="text-cyan-600"
									target="_blank"
									rel="noreferrer"
								>
									<h1>
										{contract.address}{' '}
										{contract.address === lastDeployedContract ? '(being used)' : ''}
									</h1>
								</a>
								<table className="w-full md:rounded-lg overflow-hidden mt-2">
									<thead className="bg-gray-100">
										<tr className="w-full relative">
											<th
												scope="col"
												className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
											>
												Token
											</th>
											<th
												scope="col"
												className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
											>
												Balance
											</th>
											<th
												scope="col"
												className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
											>
												Action
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200 bg-white">
										{tokens.map((token) => (
											<TokenRow key={token.id} token={token} deployer={deployer} />
										))}
									</tbody>
								</table>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

export async function getServerSideProps() {
	return {
		props: { title: 'My Escrows' }
	};
}

export default MyEscrows;
