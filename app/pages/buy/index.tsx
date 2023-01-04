import { Button, Steps } from "components"
import Amount from "components/Buy/Amount"
import Payment from "components/Buy/Payment"
import Release from "components/Buy/Release"
import { UIList } from "components/Listing/Listing.types"
import { useEffect, useState } from "react"
import { useAccount, useNetwork } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Summary } from "components/Listing"
import { ChartBarSquareIcon, StarIcon } from "@heroicons/react/20/solid"

const AMOUNT_STEP = 1
const PAYMENT_METHOD_STEP = 2
const RELEASE_STEP = 3
const DONE_STEP = 4

const SellPage = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [list, setList] = useState<UIList>({
    step: AMOUNT_STEP,
    marginType: "fixed"
  } as UIList)
  const step = list.step

  useEffect(() => {
    if (list.step > 2)
      setList({ step: PAYMENT_METHOD_STEP, marginType: "fixed" } as UIList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, chain])

  if (!address || !chain || chain.unsupported) {
    return (
      <div className="flex h-screen">
        <div className="m-auto flex flex-col justify-items-center content-center text-center">
          <span className="mb-6 text-xl">Connect to Polygon</span>{" "}
          <span className="mb-6 text-gray-500 text-xl">
            Access the OpenPeer using your favorite wallet
          </span>
          <span className="mb-4 m-auto">
            <ConnectButton showBalance={false} />
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Buy</h1>
      </div>
      <div className="w-full flex flex-row px-4 sm:px-6 md:px-8 mb-16">
        <div className="w-full lg:w-2/4">
          <Steps
            currentStep={step}
            onStepClick={(n) => setList({ ...list, ...{ step: n } })}
          />
          {step === AMOUNT_STEP && <Amount list={list} updateList={setList} />}
          {step === PAYMENT_METHOD_STEP && <Payment list={list} updateList={setList} />}
          {step === RELEASE_STEP && <Release list={list} updateList={setList} />}
          {step === DONE_STEP && (
            <div className="flex h-screen">
              <div className="m-auto flex flex-col justify-items-center content-center text-center">
                <span className="text-xl">
                  You have successfully compleated the order
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="w-2/4 hidden md:inline-block bg-white rounded-xl border-2 border-slate-100 overflow-hidden shadow-sm md:ml-16 md:px-8 md:py-4 p-4">
          <div className="flex flex-row justify-around mb-6 mt-4">
            <div>Crypto Lurd</div>
            <div className="flex flex-row">
              <ChartBarSquareIcon className="w-6 mr-2" />
              <span>150 Trades</span>
            </div>
            <div className="flex flex-row">
              <StarIcon className="w-6 mr-2 text-yellow-400" />
              <span> 4.5 </span>
            </div>
          </div>
          <ul className="flex flex-col bg-gray-100 rounded-lg p-6">
            <li className="w-full flex flex-row justify-between mb-4">
              <div>Price</div>
              <div className="font-bold">INR₹1.59</div>
            </li>
            <li className="w-full flex flex-row justify-between mb-4">
              <div>Min order</div>
              <div className="font-bold">INR₹10</div>
            </li>
            <li className="w-full flex flex-row justify-between mb-4">
              <div>Max order</div>
              <div className="font-bold">INR₹500</div>
            </li>
            <li className="w-full flex flex-row justify-between mb-4">
              <div>Payment channel</div>
              <div className="font-bold">IMG</div>
            </li>
            <li className="w-full flex flex-row justify-between mb-4">
              <div>Payment Limit</div>
              <div className="font-bold">10 minutes</div>
            </li>
          </ul>
          <div className="mt-6">
            <span className="text-[#3C9AAA]">Please Note</span>
            <p className="mt-2">
              Please do not include any crypto related keywords like USDT or OpenPeer.
              Thanks for doing business with me.
            </p>
            <Button title="Chat with merchant" outlined />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellPage
