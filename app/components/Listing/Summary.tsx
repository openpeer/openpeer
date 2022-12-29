const Summary = () => {
  return (
    <div className="w-2/4 hidden md:inline-block bg-white rounded-xl border-2 border-slate-100 overflow-hidden shadow-sm md:ml-16 md:px-8 md:py-6 p-4">
      <ul className="w-full">
        <li className="w-full flex flex-row justify-between mb-4">
          <div>Token</div>
          <div>
            <div className="flex flex-row">
              <span>IMG</span>
              <span className="font-bold">USDT</span>
            </div>
          </div>
        </li>
        <li className="w-full flex flex-row justify-between mb-4">
          <div>Fiat</div>
          <div>
            <div className="flex flex-row">
              <span>IMG</span>
              <span className="font-bold"> IND</span>
            </div>
          </div>
        </li>
        <li className="w-full flex flex-row justify-between mb-4">
          <div>Total Available Fiat</div>
          <div className="font-bold">500,000 USDT</div>
        </li>
        <li className="w-full flex flex-row justify-between mb-4">
          <div>Min Order</div>
          <div className="font-bold">₹1,000</div>
        </li>
        <li className="w-full flex flex-row justify-between mb-4">
          <div>Max Order</div>
          <div className="font-bold">₹200,000 </div>
        </li>
        <li className="w-full flex flex-row justify-between mb-4 border-bottom border-dashed border-color-gray-200">
          <div>Your Price</div>
          <div className="font-bold">₹5,000</div>
        </li>
        <div className="mt-6 mb-6 border-b-2 border-dashed border-color-gray-400"></div>
        <li className="w-full flex flex-row justify-between mb-4">
          <div>Payment Method</div>
          <div className="w-2/4 flex flex-col bg-[#F7FBFC] border-cyan-200 rounded p-4">
            <span className="text-gray-500 text-sm mb-2">Bank Transfer</span>
            <span className="mb-2">Josh Adam</span>
            <div className="flex flex-row justify-between">
              <span>09909999994</span>
              <span>bank img</span>
            </div>
          </div>
        </li>
        <li className="w-full flex flex-row justify-between mb-4">
          <div>Payment Time Limit</div>
          <div className="font-bold">15 Minutes</div>
        </li>
        <li className="w-full flex flex-row justify-between mb-4">
          <div>Order Approval</div>
          <div className="font-bold">Automatic</div>
        </li>
      </ul>
    </div>
  )
}

export default Summary
