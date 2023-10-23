/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/indent */
import Button from 'components/Button/Button';
import StepLayout from 'components/Listing/StepLayout';
import HeaderH3 from 'components/SectionHeading/h3';
import { useRouter } from 'next/router';
import React from 'react';
import { smallWalletAddress } from 'utils';
import { useAccount } from 'hooks';

import { XCircleIcon } from '@heroicons/react/24/outline';

import { BuyStepProps } from './Buy.types';

const Cancelled = ({ order }: BuyStepProps) => {
	const { list, token_amount: tokenAmount, buyer, cancelled_at: cancelledAt, seller } = order;
	const { token } = list!;
	const { address } = useAccount();
	const selling = seller.address === address;
	const router = useRouter();

	const tokenValue = `${tokenAmount} ${token.symbol}`;

	return (
		<StepLayout>
			<div className="my-8">
				<div className="mb-4">
					<span className="flex flex-row text-red-600 mb-2">
						<XCircleIcon className="w-6 mr-2" />
						<HeaderH3 title="Order Cancelled" />
					</span>
					<p className="text-base">
						{selling
							? `Your sale of ${tokenValue} to ${
									buyer?.name || smallWalletAddress(buyer?.address)
							  } has been cancelled.`
							: `Your purchase of ${tokenValue} from ${
									seller?.name || smallWalletAddress(seller.address)
							  } has been cancelled.`}
					</p>
					<p className="text-base">Cancelled at: {new Date(cancelledAt).toLocaleString()}</p>
				</div>

				<div className="border-b border-gray-200 my-4" />

				<div className="flex flex-col flex-col-reverse md:flex-row items-center justify-between mt-0">
					<span className="w-full">
						<Button title="Back to Listings" onClick={() => router.push('/trade')} />
					</span>
				</div>
			</div>
		</StepLayout>
	);
};

export default Cancelled;
