/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/indent */
import StepLayout from 'components/Listing/StepLayout';
import HeaderH3 from 'components/SectionHeading/h3';
import React from 'react';
import { useAccount } from 'hooks';

import { ClockIcon } from '@heroicons/react/24/outline';

import { BuyStepProps } from './Buy.types';
import CancelOrderButton from './CancelOrderButton/CancelOrderButton';
import OpenDisputeButton from './OpenDisputeButton';
import OrderResume from './OrderResume';
import ReleaseFundsButton from './ReleaseFundsButton';

const Release = ({ order }: BuyStepProps) => {
	const { address } = useAccount();

	const { token_amount: tokenAmount, list, fiat_amount: fiatAmount, escrow, seller } = order;
	const { token, fiat_currency: currency } = list || {};
	const selling = seller.address === address;

	return (
		<>
			<StepLayout>
				<div className="my-8">
					<div className="mb-4">
						<span className="flex flex-row text-yellow-600 mb-2">
							<ClockIcon className="w-6 mr-2" />
							<HeaderH3 title="Awaiting Release" />
						</span>
						<p className="text-base">
							This order has been marked as paid.{' '}
							{selling
								? `Please, confirm the payment of ${currency?.symbol} ${Number(fiatAmount).toFixed(
										2
								  )} in your bank and release the funds to the buyer. You can also dispute the transaction.`
								: `Awaiting confirmation from the seller and the release of ${tokenAmount} ${token?.name}.`}
						</p>
					</div>

					<OrderResume order={order} />

					<div className="flex flex-col flex-col-reverse md:flex-row items-center justify-between mt-0">
						<span className="w-full md:pr-8">
							<OpenDisputeButton order={order} />
						</span>
						<span className="w-full">
							{selling ? (
								!!escrow && <ReleaseFundsButton order={order} dispute={false} />
							) : (
								<CancelOrderButton order={order} />
							)}
						</span>
					</div>
				</div>
			</StepLayout>
		</>
	);
};

export default Release;
