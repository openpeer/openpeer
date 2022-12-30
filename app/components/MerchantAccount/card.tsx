import { CalendarIcon } from "@heroicons/react/20/solid"

const AccountCard = () => {
  return (
    <div className="w-full flex justify-between rounded bg-white border border-1 p-8">
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">Joined</span>
        <span>11 Sept, 2021</span>
      </div>
      <div>
        <div className="bg-[#EBF5F7] p-4 rounded-full">
          <CalendarIcon className="h-5 w-5 z-50" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

export default AccountCard
