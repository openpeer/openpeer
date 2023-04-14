import Button from 'components/Button/Button';
import StepLayout from 'components/Listing/StepLayout';
import HeaderH2 from 'components/SectionHeading/h2';
import { smallWalletAddress } from 'utils';
import { useAccount } from 'wagmi';

import { CheckBadgeIcon } from '@heroicons/react/24/outline';

import { BuyStepProps } from './Buy.types';
import ClipboardText from './ClipboardText';
import OrderResume from './OrderResume';

const Completed = ({ order }: BuyStepProps) => {
	const { list, token_amount: tokenAmount, buyer, seller } = order;
	const { token } = list!;
	const { address } = useAccount();
	const selling = seller.address === address;

	const tokenValue = `${tokenAmount} ${token.symbol}`;
	return (
		<>
			<StepLayout>
				<div className="my-8">
					<div className="mb-4">
						<span className="flex flex-row text-green-600 mb-2">
							<CheckBadgeIcon className="w-8 mr-2" />
							<HeaderH2 title="Purchase Complete" />
						</span>
						<p className="text-base">
							{selling
								? `You have successfully sold ${tokenValue} to ${
									buyer?.name || smallWalletAddress(buyer?.address)
								  }.`
								: `You have successfully purchased ${tokenValue} from ${
									seller?.name || smallWalletAddress(seller.address)
								  }.`}
						</p>
					</div>

					<OrderResume order={order} showRating />
				</div>
			</StepLayout>
		</>
	);
};

export default Completed;
