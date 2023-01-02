import {
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  EnvelopeIcon,
  StarIcon
} from "@heroicons/react/20/solid"
import Link from "next/link"

// interface AccountCardProps {
//   title: string
//   content: string
//   icon?: string
// }

const HeaderMetrics = () => {
  return (
    <>
      <div className="w-full flex flex-col md:flex-row mb-8">
        <div className="w-full md:w-1/4 flex justify-center items-center text-center rounded-lg bg-white border border-1 p-8 mr-6 mb-6 md:mb-0">
          <div className="flex flex-col items-center">
            <span className="m-auto flex items-center justify-center bg-[#EBF5F7] w-24 h-24 rounded-full">
              IMG
            </span>
            <div className="flex items-center pl-4 text-lg mb-2 mt-4">
              <span className="mr-2">Crypto Lurd</span>
              <span>
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15.5173 7.60444L14.4829 6.32107C14.3201 6.11037 14.2148 5.86136 14.186 5.58362L14.0041 3.95547C13.9671 3.63036 13.8211 3.32738 13.5897 3.09602C13.3584 2.86466 13.0554 2.71859 12.7303 2.68168L11.1021 2.49971C10.8148 2.47098 10.5658 2.34647 10.3551 2.18366L9.07173 1.1493C8.54497 0.727901 7.79794 0.727901 7.27118 1.1493L5.98782 2.18366C5.77712 2.34647 5.52811 2.45182 5.25036 2.48056L3.62222 2.66253C2.9518 2.73914 2.42505 3.2659 2.34843 3.93631L2.16646 5.56446C2.13773 5.85178 2.01322 6.10079 1.85041 6.31149L0.816052 7.59486C0.394649 8.12161 0.394649 8.86865 0.816052 9.3954L1.85041 10.6788C2.01322 10.8895 2.11857 11.1385 2.1473 11.4162L2.32927 13.0444C2.40589 13.7148 2.93265 14.2415 3.60306 14.3182L5.23121 14.5001C5.51853 14.5289 5.76754 14.6534 5.97824 14.8162L7.26161 15.8505C7.78836 16.2719 8.53539 16.2719 9.06215 15.8505L10.3455 14.8162C10.5562 14.6534 10.8052 14.548 11.083 14.5193L12.7111 14.3373C13.3815 14.2607 13.9083 13.7339 13.9849 13.0635L14.1669 11.4354C14.1956 11.1481 14.3201 10.899 14.4829 10.6883L15.5173 9.40498C15.9387 8.87822 15.9387 8.13119 15.5173 7.60444ZM6.73485 12.3356L3.38278 8.98357L4.81938 7.54697L6.73485 9.46244L11.5235 4.67377L12.9601 6.15826L6.73485 12.3356Z"
                    fill="#3C9AAA"
                  />
                </svg>
              </span>
            </div>
            <span className="text-sm mb-4">@crypto100</span>
            <div className="flex flex-row">
              <Link
                href=""
                className="flex items-center py-2 px-6 border boder-2 rounded"
              >
                Follow
              </Link>
              <Link
                href=""
                className="flex items-center py-2 px-6 border boder-2 rounded ml-2"
              >
                <EnvelopeIcon className="h-5 w-5 z-50" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
        <div>
          <div className="w-full flex flex-col md:flex-row justify-around gap-6">
            <div className="w-full flex justify-between items-center rounded-lg bg-white border border-1 p-8">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Joined</span>
                <span>11 Sept, 2021</span>
              </div>
              <div>
                <div className="bg-[#EBF5F7] p-4 rounded-full">
                  <CalendarIcon
                    className="h-5 w-5 z-50 text-[#3C9AAA]"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex justify-between items-center rounded-lg bg-white border border-1 p-8">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Trades</span>
                <span>130</span>
              </div>
              <div>
                <div className="bg-[#EBF5F7] p-4 rounded-full">
                  <ChartBarIcon
                    className="h-5 w-5 z-50 text-[#3C9AAA]"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex justify-between items-center rounded-lg bg-white border border-1 p-8">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Reviews</span>
                <span>3,000</span>
              </div>
              <div>
                <div className="bg-[#EBF5F7] p-4 rounded-full">
                  <StarIcon className="h-5 w-5 z-50 text-[#3C9AAA]" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col md:flex-row justify-around gap-6 mt-4">
            <div className="w-full flex justify-between items-center rounded-lg bg-white border border-1 p-8">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Completion Rate</span>
                <span>98%</span>
              </div>
              <div>
                <div className="bg-[#EBF5F7] p-4 rounded-full">
                  <ChartBarIcon
                    className="h-5 w-5 z-50 text-[#3C9AAA]"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex justify-between items-center rounded-lg bg-white border border-1 p-8">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Avg Crypto Release Time</span>
                <span>5 Minutes</span>
              </div>
              <div>
                <div className="bg-[#EBF5F7] p-4 rounded-full">
                  <ClockIcon className="h-5 w-5 z-50 text-[#3C9AAA]" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="w-full flex justify-between items-center rounded-lg bg-white border border-1 p-8">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Avg Payout Time</span>
                <span>5 Minutes</span>
              </div>
              <div>
                <div className="bg-[#EBF5F7] p-4 rounded-full">
                  <ClockIcon className="h-5 w-5 z-50 text-[#3C9AAA]" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HeaderMetrics
