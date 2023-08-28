import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { useConfirmationSignMessage } from 'hooks';
import { useRouter } from 'next/router';
import React from 'react';
import snakecaseKeys from 'snakecase-keys';
import { useAccount, useNetwork } from 'wagmi';
import { polygon } from 'wagmi/chains';

import Label from '../Label/Label';
import Selector from '../Selector';
import Textarea from '../Textarea/Textarea';
import { ListStepProps } from './Listing.types';
import StepLayout from './StepLayout';

const Details = ({ list, updateList }: ListStepProps) => {
	const { terms, depositTimeLimit, paymentTimeLimit, type } = list;
	const { address } = useAccount();
	const { chain, chains } = useNetwork();
	const router = useRouter();
	const chainId = chain?.id || chains[0]?.id || polygon.id;

	const { signMessage } = useConfirmationSignMessage({
		onSuccess: async (data, variables) => {
			const result = await fetch(
				list.id ? `/api/lists/${list.id}` : '/api/lists',

				{
					method: list.id ? 'PUT' : 'POST',
					body: JSON.stringify(
						snakecaseKeys(
							{
								chainId,
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

	const onProceed = () => {
		const message = JSON.stringify(snakecaseKeys(list, { deep: true }), undefined, 4);
		signMessage({ message });
	};

	const onTermsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		updateList({ ...list, ...{ terms: event.target.value } });
	};

	return (
		<StepLayout onProceed={onProceed} buttonText="Sign and Finish">
			<div className="my-8">
				<Label title="Deposit Time Limit" />
				<div className="mb-4">
					<span className="text-sm text-gray-600">
						{depositTimeLimit > 0 ? (
							<div>
								Your order will be cancelled if {type === 'SellList' ? 'you' : 'the seller'} dont
								deposit after {depositTimeLimit} {depositTimeLimit === 1 ? 'minute' : 'minutes'}.{' '}
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
