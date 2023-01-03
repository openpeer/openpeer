import { StepProps } from "components/Listing/Listing.types"
import StepLayout from "components/Listing/StepLayout"

const Release = ({ list, updateList }: StepProps) => {
  const { terms } = list
  const onProceed = () => {
    updateList({ ...list, ...{ step: list.step + 1 } })
  }

  return (
    <>
      <StepLayout onProceed={onProceed}>
        <div className="my-8">Release</div>
      </StepLayout>
    </>
  )
}

export default Release
