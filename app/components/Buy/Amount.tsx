import Input from "components/Input/Input"
import { StepProps } from "components/Listing/Listing.types"
import StepLayout from "components/Listing/StepLayout"

const Amount = ({ list, updateList }: StepProps) => {
  const { terms } = list
  const onProceed = () => {
    updateList({ ...list, ...{ step: list.step + 1 } })
  }

  return (
    <>
      <StepLayout onProceed={onProceed}>
        <div className="my-8">
          <Input label="Amount to buy" id={""} />
          <Input label="Amount you’ll receive" id={""} />
        </div>
      </StepLayout>
    </>
  )
}

export default Amount
