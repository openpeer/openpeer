const Summary = () => {
  return (
    <div className="SUMMARY-CARD w-2/4 hidden md:inline-flex rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm md:ml-16 md:px-8 md:py-6 p-4">
      <ul className="w-full">
        <li className="w-full flex flex-row justify-between mb-4">
          <div>Token</div>
          <div>
            <div className="flex flex-row">
              <span>IMG</span>
              <span>USDT</span>
            </div>
          </div>
        </li>
        <li className="w-full flex flex-row justify-between mb-4">
          <div>Fiat</div>
          <div>
            <div className="flex flex-row">
              <span>IMG</span>
              <span>IND</span>
            </div>
          </div>
        </li>
        <li className="w-full flex flex-row justify-between mb-4">
          <div>Total Available Fiat</div>
          <div>500,000 USDT</div>
        </li>
        <li className="w-full flex flex-row justify-between mb-4">
          <div>Min Order</div>
          <div>₹1,000</div>
        </li>
        <li className="w-full flex flex-row justify-between mb-4">
          <div>Max Order</div>
          <div>₹200,000 </div>
        </li>
        <li className="w-full flex flex-row justify-between mb-4 border-bottom border-dashed border-color-gray-200">
          <div>Your Price</div>
          <div>₹5,000</div>
        </li>
        <div className="mt-6 mb-6 border-b-2 border-dashed border-color-gray-400"></div>
        <li className="w-full flex flex-row justify-between mb-4">
          <div>Payment Method</div>
          <div className="flex flex-row">
            <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-0.5 text-sm font-medium text-gray-800">
              Bank Transfer
            </span>
            <span>IMG</span>
          </div>
        </li>
        <li className="w-full flex flex-row justify-between mb-4">
          <div>Payment Time Limit</div>
          <div>15 Minutes</div>
        </li>
        <li className="w-full flex flex-row justify-between mb-4">
          <div>Order Approval</div>
          <div>Automatic</div>
        </li>
      </ul>
    </div>
  )
}

export default Summary
