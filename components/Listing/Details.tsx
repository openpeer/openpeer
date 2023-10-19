/* eslint-disable @typescript-eslint/indent */
import { getAuthToken } from '@dynamic-labs/sdk-react';
import { useConfirmationSignMessage, useAccount } from 'hooks';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import snakecaseKeys from 'snakecase-keys';

import { Token } from 'models/types';
import Checkbox from 'components/Checkbox/Checkbox';
import { useContractRead } from 'wagmi';
import { DEPLOYER_CONTRACTS } from 'models/networks';
import { OpenPeerDeployer, OpenPeerEscrow } from 'abis';
import { parseUnits } from 'viem';
import { constants } from 'ethers';
import Label from '../Label/Label';
import Selector from '../Selector';
import Textarea from '../Textarea/Textarea';
import { ListStepProps } from './Listing.types';
import StepLayout from './StepLayout';
import FundEscrow from './FundEscrow';

const Details = ({ list, updateList }: ListStepProps) => {
	const [fund, setFund] = useState(false);
	const { terms, depositTimeLimit, paymentTimeLimit, type, chainId, token, acceptOnlyVerified, escrowType } = list;
	const { address } = useAccount();
	const router = useRouter();

	const { signMessage } = useConfirmationSignMessage({
		onSuccess: async (data, variables) => {
			const result = await fetch(
				list.id ? `/api/lists/${list.id}` : '/api/lists',

				{
					method: list.id ? 'PUT' : 'POST',
					body: JSON.stringify(
						snakecaseKeys(
							{
								chainId: chainId || (token as Token).chain_id,
								list,
								data,
								address,
								message: variables.message
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

	const onTermsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		updateList({ ...list, ...{ terms: event.target.value } });
	};

	const { data: sellerContract } = useContractRead({
		address: DEPLOYER_CONTRACTS[chainId],
		abi: OpenPeerDeployer,
		functionName: 'sellerContracts',
		args: [address],
		enabled: !!address && escrowType === 'instant',
		watch: true
	});

	const { data: balance } = useContractRead({
		address: sellerContract as `0x${string}`,
		abi: OpenPeerEscrow,
		functionName: 'balances',
		args: [(token as Token).address],
		enabled: !!sellerContract && sellerContract !== constants.AddressZero,
		watch: true
	});

	const needToDeploy = escrowType === 'instant' && (!sellerContract || sellerContract === constants.AddressZero);
	const needToFund =
		!balance ||
		(balance as bigint) <
			parseUnits(String(list.limitMax || list.totalAvailableAmount || 0), (token as Token)!.decimals);

	const needToDeployOrFund = needToDeploy || needToFund;

	useEffect(() => {
		if (!needToDeployOrFund && fund) {
			setFund(false);
		}
	}, [needToDeployOrFund]);

	const onProceed = () => {
		if (needToDeployOrFund) {
			setFund(true);
		} else {
			const message = JSON.stringify(snakecaseKeys(list, { deep: true }), undefined, 4);
			signMessage({ message });
		}
	};

	if (fund) {
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
					? 'Deploy Escrow Contract'
					: 'Deposit in the Escrow Contract'
			}
		>
			<div className="my-8">
				<Label title="Deposit Time Limit" />
				{list.escrowType === 'manual' && (
					<>
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

				<div className="mb-4">
					<Checkbox
						content={`Accept only verified ${type === 'SellList' ? 'buyers' : 'sellers'}`}
						id="verified"
						name="verified"
						checked={acceptOnlyVerified}
						onChange={() => updateList({ ...list, ...{ acceptOnlyVerified: !acceptOnlyVerified } })}
					/>
				</div>
				<div className="hidden">
					<Label title="Payment Time Limit" />
					<div className="mb-4">
						<span className="text-sm text-gray-600">
							{paymentTimeLimit > 0 ? (
								<div>
									Your order will be cancelled if {type === 'SellList' ? 'the buyer' : 'you'} dont pay
									after {paymentTimeLimit} {paymentTimeLimit === 1 ? 'minute' : 'minutes'}.{' '}
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
						value={paymentTimeLimit}
						suffix={paymentTimeLimit === 1 ? ' min' : ' mins'}
						changeableAmount={1}
						updateValue={(n) => updateList({ ...list, ...{ paymentTimeLimit: n } })}
						decimals={0}
					/>
				</div>
				<Textarea
					label="Order Terms"
					rows={4}
					id="terms"
					placeholder="Write the terms and conditions for your listing here"
					value={terms}
					onChange={onTermsChange}
				/>
			</div>
		</StepLayout>
	);
};

export default Details;
