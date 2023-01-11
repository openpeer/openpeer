import { Textarea } from 'components';
import { verifyMessage } from 'ethers/lib/utils.js';
import { useRouter } from 'next/router';
import snakecaseKeys from 'snakecase-keys';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';

import { ListStepProps } from './Listing.types';
import StepLayout from './StepLayout';

const Details = ({ list, updateList }: ListStepProps) => {
	const { terms } = list;
	const router = useRouter();
	const { address } = useAccount();
	const { chain, chains } = useNetwork();
	const chainId = chain?.id || chains[0]?.id;

	const { signMessage } = useSignMessage({
		onSuccess: async (data, variables) => {
			const signingAddress = verifyMessage(variables.message, data);
			if (signingAddress === address) {
				const result = await fetch(
					'/api/lists',

					{
						method: 'POST',
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
						)
					}
				);
				const { id } = await result.json();

				if (id) {
					router.push('/');
				}
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
				{/* <Label title="Time Limit for Payment" />
        <Selector value={10} suffix=" mins" updateValue={() => console.log('update')} /> */}
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
