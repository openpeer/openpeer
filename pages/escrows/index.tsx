import { OpenPeerDeployer, OpenPeerEscrow } from 'abis';
import { Accordion, Button, EscrowDepositWithdraw, Token as TokenImage } from 'components';
import DeploySellerContract from 'components/Buy/EscrowButton/DeploySellerContract';
import HeaderH3 from 'components/SectionHeading/h2';
import NetworkSelect from 'components/Select/NetworkSelect';
import { useAccount, useUserProfile } from 'hooks';
import { DEPLOYER_CONTRACTS, allChains } from 'models/networks';
import React, { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { Chain, useContractRead, useNetwork, useSwitchNetwork } from 'wagmi';
import { Contract, Token } from 'models/types';
import { smallWalletAddress } from 'utils';

const ContractTable = ({
	contract,
	tokens,
	beingUsed,
	chain,
	needToDeploy,
	onSelectToken
}: {
	contract: Contract;
	tokens: Token[];
	beingUsed: boolean;
	needToDeploy: boolean;
	chain: Chain | undefined;
	onSelectToken: (token: Token, contract: Contract, action: 'Withdraw' | 'Deposit') => void;
}) => (
	<div className="mt-4" key={contract.id}>
		{beingUsed && (
			<div className="flex flex-col md:flex-row md:items-center md:space-x-1">
				<a
					href={`${chain?.blockExplorers?.etherscan?.url}/address/${contract.address}`}
					className="text-cyan-600"
					target="_blank"
					rel="noreferrer"
				>
					<h1>{contract.address} </h1>
				</a>
				<span className="text-sm">{beingUsed ? '(being used)' : ''}</span>
			</div>
		)}
		<table className="w-full md:rounded-lg overflow-hidden mt-2">
			<thead className="bg-gray-100">
				<tr className="w-full relative">
					<th
						scope="col"
						className="hidden py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:table-cell"
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
			<tbody className="divide-y divide-gray-200">
				{tokens
					.filter((t) => t.chain_id === chain?.id)
					.map((t) => (
						<TokenRow
							key={t.id}
							token={t}
							contract={contract}
							depositDisabled={!beingUsed || needToDeploy}
							onSelectToken={onSelectToken}
						/>
					))}
			</tbody>
		</table>
	</div>
);

const TokenRow = ({
	token,
	contract,
	depositDisabled,
	onSelectToken
}: {
	token: Token;
	contract: Contract;
	depositDisabled: boolean;
	onSelectToken: (token: Token, contract: Contract, action: 'Withdraw' | 'Deposit') => void;
}) => {
	const { address } = useAccount();

	const { data } = useContractRead({
		address: contract.address,
		abi: OpenPeerEscrow,
		functionName: 'balances',
		args: [token.address],
		enabled: !!address,
		chainId: token.chain_id
	});

	return (
		<tr className="hover:bg-gray-50">
			<div className="mt-2 flex flex-col text-gray-500 lg:hidden">
				<div className="fw-full lex flex-col space-y-4">
					<div className="flex flex-row items-center space-x-1">
						<TokenImage size={24} token={token} />

						<span className="text-sm">
							{data === undefined
								? token.symbol
								: `${formatUnits(data as bigint, token.decimals)} ${token.symbol}`}
						</span>
					</div>
					<span className="w-full flex flex-row space-x-4 pb-4">
						<Button
							title="Deposit"
							disabled={depositDisabled}
							onClick={() => onSelectToken(token, contract, 'Deposit')}
						/>
						<Button
							title="Withdraw"
							disabled={!data || (data as bigint) <= BigInt(0)}
							onClick={() => onSelectToken(token, contract, 'Withdraw')}
						/>
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
				{data === undefined ? '' : `${formatUnits(data as bigint, token.decimals)} ${token.symbol}`}
			</td>
			<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
				<div className="w-full flex flex-row space-x-4">
					<Button
						title="Deposit"
						disabled={depositDisabled}
						onClick={() => onSelectToken(token, contract, 'Deposit')}
					/>
					<Button
						title="Withdraw"
						disabled={!data || (data as bigint) <= BigInt(0)}
						onClick={() => onSelectToken(token, contract, 'Withdraw')}
					/>
				</div>
			</td>
		</tr>
	);
};

const MyEscrows = () => {
	const { address } = useAccount();
	const { chain: connectedChain } = useNetwork();
	const { switchNetwork } = useSwitchNetwork();

	const [chain, setChain] = useState<Chain>();
	const [loading, setLoading] = useState(false);
	const { user } = useUserProfile({});
	const [lastVersion, setLastVersion] = useState(0);
	const [tokens, setTokens] = useState<Token[]>([]);

	// deposit withdraw params
	const [action, setAction] = useState<'Deposit' | 'Withdraw'>('Deposit');
	const [token, setToken] = useState<Token>();
	const [contract, setContract] = useState<Contract>();

	const deployer = DEPLOYER_CONTRACTS[chain?.id || 0];
	const chainInUse = allChains.find((c) => c.id === chain?.id);

	const { data: sellerContract } = useContractRead({
		address: deployer,
		abi: OpenPeerDeployer,
		functionName: 'sellerContracts',
		args: [address],
		enabled: !!chain,
		watch: true,
		chainId: chain?.id,
		account: address
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
		setLoading(true);
		const fetchTokens = async () => {
			const response = await fetch('/api/tokens');
			setTokens(await response.json());
			setLoading(false);
		};

		fetchTokens();
	}, []);

	useEffect(() => {
		const fetchSettings = async () => {
			const response = await fetch('/api/settings');
			const settings: { [key: string]: string } = await response.json();
			setLastVersion(Number(settings.contract_version || 0));
		};
		fetchSettings();
	}, []);

	const contracts = (user?.contracts || []).filter((c) => c.chain_id === chain?.id && Number(c.version) >= 2);

	const lastDeployedVersion = contracts.reduce((acc, c) => Math.max(acc, Number(c.version)), 0);
	const needToDeploy = contracts.length === 0 || lastDeployedVersion < lastVersion;
	const lastDeployedContract = sellerContract as `0x${string}` | undefined;
	const contractInUse = contracts.find((c) => c.address.toLowerCase() === (lastDeployedContract || '').toLowerCase());
	const otherContracts = contracts.filter(
		(c) => c.address.toLowerCase() !== (lastDeployedContract || '').toLowerCase()
	);

	const onSelectToken = (t: Token, c: Contract, a: 'Withdraw' | 'Deposit') => {
		setToken(t);
		setAction(a);
		setContract(c);
	};

	const onBack = () => {
		setToken(undefined);
		setContract(undefined);
		setAction('Deposit');
	};

	if (action && token && contract) {
		return (
			<EscrowDepositWithdraw
				action={action}
				token={token}
				contract={contract.address}
				onBack={onBack}
				canDeposit={contract === contractInUse && !needToDeploy}
				canWithdraw
			/>
		);
	}

	return (
		<div className="px-6 w-full flex flex-col items-center justify-center mt-4 pt-4 md:pt-6 text-gray-700">
			<div className="w-full lg:w-1/2 flex flex-col mb-16">
				<HeaderH3 title="Deposit or Withdraw funds" />
				<div className="border border-slate-300 mt-4 rounded">
					<div className="p-4">
						<span>Begin by selecting the chain</span>
						<div className="w-full lg:w-fit">
							<NetworkSelect onSelect={setChain} selected={chain} />
						</div>
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
								{chain?.id === connectedChain?.id ? (
									<DeploySellerContract label="Deploy a new contract" />
								) : (
									<Button title="Deploy a new contract" onClick={() => switchNetwork?.(chain!.id)} />
								)}
							</div>
						)}
					</div>
					{!!user && !loading && (
						<>
							{contractInUse && (
								<ContractTable
									contract={contractInUse}
									tokens={tokens}
									beingUsed
									chain={chainInUse}
									needToDeploy={needToDeploy}
									onSelectToken={onSelectToken}
								/>
							)}
							{otherContracts.map((c) => (
								<div className="break-all text-left">
									<Accordion
										content={
											<div className="px-4 pb-4">
												<ContractTable
													contract={c}
													tokens={tokens}
													beingUsed={false}
													chain={chainInUse}
													needToDeploy={needToDeploy}
													onSelectToken={onSelectToken}
												/>
											</div>
										}
										title={
											<a
												href={`${chainInUse?.blockExplorers?.etherscan?.url}/address/${c.address}`}
												className="text-cyan-600 flex flex-row items-center space-x-2"
												target="_blank"
												rel="noreferrer"
											>
												{/* <WalletIcon className="w-4 h-4" /> */}
												<h1 className="text-left">{smallWalletAddress(c.address)}</h1>
											</a>
										}
									/>
								</div>
							))}
						</>
					)}
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
