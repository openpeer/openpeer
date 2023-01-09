import Input from 'components/Input/Input';
import InputToken from 'components/Input/InputToken';
import { StepProps } from 'components/Listing/Listing.types';
import StepLayout from 'components/Listing/StepLayout';

const Amount = ({ list, updateList }: StepProps) => {
	const { terms } = list;
	const onProceed = () => {
		updateList({ ...list, ...{ step: list.step + 1 } });
	};

	return (
		<>
			<StepLayout onProceed={onProceed} buttonText="Continue">
				<div className="my-8">
					<InputToken label="Amount to buy" currency="INR₹" id={''} />
					<InputToken label="Amount you’ll receive" currency="USDT" id={''} />
				</div>
			</StepLayout>
		</>
	);
};

export default Amount;
