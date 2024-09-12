import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { useConfirmationSignMessage, useAccount } from 'hooks';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import snakecaseKeys from 'snakecase-keys';

import { Token, User } from 'models/types';
import Checkbox from 'components/Checkbox/Checkbox';
import { useContractRead } from 'wagmi';
import { DEPLOYER_CONTRACTS } from 'models/networks';
import { OpenPeerDeployer, OpenPeerEscrow } from 'abis';
import { parseUnits } from 'viem';
import { constants } from 'ethers';
import { listToMessage } from 'utils';
import dynamic from 'next/dynamic';
import Label from 'components/Label/Label';
import Selector from 'components/Selector';
import AddressTooltip from 'components/AddressTooltip';
import { ListStepProps } from 'components/Listing/Listing.types';
import StepLayout from 'components/Listing/StepLayout';
import FundEscrow from 'components/Listing/FundEscrow';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });

const Details = ({ list, updateList }: ListStepProps) => {
	if (!list) {
		return <div>Loading...</div>;
	}

	const { terms, depositTimeLimit, paymentTimeLimit, type, chainId, token, acceptOnlyVerified, escrowType } = list;
	const { address } = useAccount();
	const router = useRouter();

	const [trustedUsers, setTrustedUsers] = useState<User[]>([]);
	const [selectedTrustedUsers, setSelectedTrustedUsers] = useState<User[]>([]);
	const [acceptOnlyTrusted, setAcceptOnlyTrusted] = useState(false);
	const [ethAddress, setEthAddress] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		// Fetch trusted users from the API or state
		// Example: setTrustedUsers(fetchedTrustedUsers);
	}, []);

	const { signMessage } = useConfirmationSignMessage({
		onSuccess: async (data) => {
			const result = await fetch(
				list.id ? `/api/lists/${list.id}` : '/api/lists',

				{
					method: list.id ? 'PUT' : 'POST',
					body: JSON.stringify(
						snakecaseKeys(
							{
								list: { ...list, ...{ bankIds: (list.banks || []).map((b) => b.id) } },
								data
							},
							{ deep: true }
						)
					),
					headers: {
						Authorization: `Bearer ${getAuthToken()}`
					}
				}
			);
			const { id } = await result.json();

			if (id) {
				router.push(`/${address}`);
			}
		}
	});

	const onTermsChange = (value: string) => {
		updateList({ ...list, ...{ terms: value } });
	};

	const { data: sellerContract } = useContractRead({
		address: DEPLOYER_CONTRACTS[chainId],
		abi: OpenPeerDeployer,
		functionName: 'sellerContracts',
		args: [address],
		enabled: !!address && escrowType === 'instant',
		chainId,
		watch: true
	});

	const { data: balance } = useContractRead({
		address: sellerContract as `0x${string}`,
		abi: OpenPeerEscrow,
		functionName: 'balances',
		args: [(token as Token).address],
		enabled: !!sellerContract && sellerContract !== constants.AddressZero,
		chainId,
		watch: true
	});

	const needToDeploy = !sellerContract || sellerContract === constants.AddressZero;
	const needToFund =
		!balance ||
		(balance as bigint) < parseUnits(String((list.totalAvailableAmount || 0) / 4), (token as Token)!.decimals);

	const needToDeployOrFund = escrowType === 'instant' && (needToDeploy || needToFund);

	const onProceed = () => {
		if (!needToDeployOrFund) {
			const message = listToMessage(list);
			signMessage({ message });
		}
	};

	const handleAddTrustedUser = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		try {
			const response = await fetch(`/api/users/${ethAddress}`, {
				headers: {
					Authorization: `Bearer ${getAuthToken()}`
				}
			});
			const user = await response.json();

			if (user.errors) {
				setError('User not found');
			} else {
				setSelectedTrustedUsers([...selectedTrustedUsers, user]);
				updateList({ ...list, ...{ trustedUsers: [...selectedTrustedUsers, user] } });
				setEthAddress('');
			}
		} catch (err) {
			setError('Failed to fetch user');
		}
	};

	const handleDeleteTrustedUser = (userId: number) => {
		const updatedUsers = selectedTrustedUsers.filter((user) => user.id !== userId);
		setSelectedTrustedUsers(updatedUsers);
		updateList({ ...list, ...{ trustedUsers: updatedUsers } });
	};

	const shortenAddress = (address: string) => {
		return `${address.slice(0, 6)}...${address.slice(-6)}`;
	};

	if (needToDeployOrFund) {
		return (
			<FundEscrow
				token={token as Token}
				sellerContract={sellerContract as `0x${string}` | undefined}
				chainId={chainId}
				balance={(balance || BigInt(0)) as bigint}
				totalAvailableAmount={list.totalAvailableAmount!}
			/>
		);
	}

	return (
		<StepLayout
			onProceed={onProceed}
			buttonText={
				!needToDeployOrFund
					? 'Sign and Finish'
					: needToDeploy
					? 'Create Escrow Account'
					: 'Deposit in the Escrow Account'
			}
		>
			<div className="my-8">
				{list.escrowType === 'manual' && (
					<>
						<Label title="Deposit Time Limit" />
						<div className="mb-4">
							<span className="text-sm text-gray-600">
								{depositTimeLimit > 0 ? (
									<div>
										Your order will be cancelled if {type === 'SellList' ? 'you' : 'the seller'}{' '}
										dont deposit after {depositTimeLimit}{' '}
										{depositTimeLimit === 1 ? 'minute' : 'minutes'}.{' '}
										<strong>You can set this to 0 to disable this feature.</strong>
									</div>
								) : (
									<div>
										Your orders will not be cancelled automatically.{' '}
										<strong>You can set this to 0 to disable this feature.</strong>
									</div>
								)}
							</span>
						</div>
						<Selector
							value={depositTimeLimit}
							suffix={depositTimeLimit === 1 ? ' min' : ' mins'}
							changeableAmount={1}
							updateValue={(n) => updateList({ ...list, ...{ depositTimeLimit: n } })}
							decimals={0}
						/>
					</>
				)}

				<Label title="Payment Time Limit" />
				<div className="mb-4">
					<span className="text-sm text-gray-600">
						{paymentTimeLimit > 0 ? (
							<div>
								Your order can be cancelled if {type === 'SellList' ? 'the buyer' : 'you'} dont pay
								after {paymentTimeLimit} {paymentTimeLimit === 1 ? 'minute' : 'minutes'}.{' '}
								<strong>Minimum 15 minutes. Maximum 24 hours.</strong>
							</div>
						) : (
							<div>Your orders will not be cancelled automatically. </div>
						)}
					</span>
				</div>
				<Selector
					value={paymentTimeLimit}
					suffix={paymentTimeLimit === 1 ? ' min' : ' mins'}
					changeableAmount={1}
					updateValue={(n) => updateList({ ...list, ...{ paymentTimeLimit: n } })}
					decimals={0}
					minValue={15}
					maxValue={24 * 60}
				/>

				<div className="mb-[-2]">
					<Checkbox
						content={`Accept only verified ${type === 'SellList' ? 'buyers' : 'sellers'} (KYC)`}
						id="verified"
						name="verified"
						checked={acceptOnlyVerified}
						onChange={() => updateList({ ...list, ...{ acceptOnlyVerified: !acceptOnlyVerified } })}
					/>
				</div>

				<div className="mb-4">
					<Checkbox
						content="Accept transactions only from trusted traders that you nominate"
						id="trusted"
						name="trusted"
						checked={acceptOnlyTrusted}
						onChange={() => setAcceptOnlyTrusted(!acceptOnlyTrusted)}
					/>
				</div>

				{acceptOnlyTrusted && (
					<div className="mb-4">
						<Label title="Select Your Trusted Traders" />
						{selectedTrustedUsers.length > 0 && (
							<ul className="my-4 flex flex-wrap">
								{selectedTrustedUsers.map((user) => (
									<li
										key={user.id}
										className="p-2 mx-1 my-2 rounded-lg border border-blue-700 bg-blue-100 text-xs flex items-center justify-center"
									>
										<span className="font-bold">{user.name}</span> (
										<AddressTooltip content={user.address}>
											<span>{shortenAddress(user.address)}</span>
										</AddressTooltip>
										)
										<button
											onClick={() => handleDeleteTrustedUser(user.id)}
											title="Delete from your trusted traders"
										>
											<svg
												fill="#EF4444"
												width="16px"
												height="18px"
												viewBox="0 0 32 32"
												version="1.1"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path d="M8 26c0 1.656 1.343 3 3 3h10c1.656 0 3-1.344 3-3l2-16h-20l2 16zM19 13h2v13h-2v-13zM15 13h2v13h-2v-13zM11 13h2v13h-2v-13zM25.5 6h-6.5c0 0-0.448-2-1-2h-4c-0.553 0-1 2-1 2h-6.5c-0.829 0-1.5 0.671-1.5 1.5s0 1.5 0 1.5h22c0 0 0-0.671 0-1.5s-0.672-1.5-1.5-1.5z"></path>
											</svg>
										</button>
									</li>
								))}
							</ul>
						)}
						<form onSubmit={handleAddTrustedUser}>
							<input
								type="text"
								placeholder="Enter Ethereum address"
								value={ethAddress}
								onChange={(e) => setEthAddress(e.target.value)}
								className="my-2 mr-2 p-2 border rounded min-w-72"
							/>
							<button type="submit" className="p-2 bg-blue-500 text-white rounded">
								Add Trusted Trader
							</button>
						</form>
						{error && <p className="text-red-500">{error}</p>}
					</div>
				)}

				<Label title="Order Terms" />
				<QuillEditor
					value={terms}
					onChange={onTermsChange}
					placeholder="Write the terms and conditions for your listing here"
				/>
			</div>
		</StepLayout>
	);
};

export default Details;
