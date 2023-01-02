import { Textarea } from 'components';

import { StepProps } from './Listing.types';
import StepLayout from './StepLayout';

const Details = ({ list, updateList }: StepProps) => {
  const { terms } = list;
  const onProceed = () => {
    updateList({ ...list, ...{ step: list.step + 1 } });
  };

  const onTermsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateList({ ...list, ...{ terms: event.target.value } });
  };

  return (
    <StepLayout onProceed={onProceed}>
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
