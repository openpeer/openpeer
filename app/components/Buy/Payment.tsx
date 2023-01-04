import { ClipboardDocumentIcon } from "@heroicons/react/20/solid"
import { StepProps } from "components/Listing/Listing.types"
import StepLayout from "components/Listing/StepLayout"
import HeaderH2 from "components/SectionHeading/h2"

const Payment = ({ list, updateList }: StepProps) => {
  const { terms } = list
  const onProceed = () => {
    updateList({ ...list, ...{ step: list.step + 1 } })
  }

  return (
    <>
      <StepLayout onProceed={onProceed}>
        <div className="my-8">
          <HeaderH2 title="Awaiting Merchant Approval" />
          <p className="text-base">
            Kindly wait for the merchant to accept the order and escrow their funds.
            Payments details will become visible as soon as merchant accepts.
          </p>
          <div className="hidden">
            <HeaderH2 title="Pay Merchant" />
            <p className="text-base">
              Proceed to your bank app or payment platform and send the required amount to
              the bank account details below.
            </p>
          </div>
          <div className="flex flex-row justify-around bg-gray-100 rounded-lg p-6 my-4">
            <div className="flex flex-col">
              <span className="text-sm">Amount to pay</span>
              <span className="text-xl">INR₹159</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm">Price</span>
              <span className="text-xl">INR₹1,000</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm">Amount to receive</span>
              <span className="text-xl">159 USDT</span>
            </div>
          </div>

          <div className="w-full bg-white rounded-lg border border-color-gray-100 p-6">
            <div className="flex flex-row justify-between mb-4">
              <span>Account Name</span>
              <span className="flex flex-row justify-between">
                <span className="mr-2">Josh Reyes</span>
                <ClipboardDocumentIcon className="w-4 text-gray-500" />
              </span>
            </div>
            <div className="flex flex-row justify-between mb-4">
              <span>Account Number</span>
              <span className="flex flex-row justify-between">
                <span className="mr-2">011223332222</span>
                <ClipboardDocumentIcon className="w-4 text-gray-500" />
              </span>
            </div>
            <div className="flex flex-row justify-between mb-4">
              <span>Bank Name</span>
              <span className="flex flex-row justify-between">
                <span className="mr-2">Revolut</span>
                <ClipboardDocumentIcon className="w-4 text-gray-500" />
              </span>
            </div>
            <div className="flex flex-row justify-between mb-4">
              <span>Reference No.</span>
              <span className="flex flex-row justify-between">
                <span className="mr-2">011223332222</span>
                <ClipboardDocumentIcon className="w-4 text-gray-500" />
              </span>
            </div>
            <div className="border-bottom border border-color-gray-200 mb-4"></div>
            <div className="flex flex-row justify-between">
              <span>Payment will expire in </span>
              <span className="flex flex-row justify-between">
                <span className="text-[#3C9AAA]">15m:20secs</span>
              </span>
            </div>
          </div>
        </div>
      </StepLayout>
    </>
  )
}

export default Payment
