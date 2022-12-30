import { CalendarIcon } from "@heroicons/react/20/solid"
import Card from "components/MerchantAccount/card"
import { formatUnits } from "ethers/lib/utils.js"
import { useEffect, useState } from "react"
import { useNetwork } from "wagmi"

import Button from "../components/Button/Button"
import { List } from "../models/types"

const HomePage = () => {
  const [lists, setLists] = useState<List[]>([])
  const [isLoading, setLoading] = useState(false)
  const { chain, chains } = useNetwork()
  const chainId = chain?.id || chains[0]?.id
  useEffect(() => {
    setLoading(true)
    fetch(`/api/lists?chain_id=${chainId}`)
      .then((res) => res.json())
      .then((data) => {
        setLists(data)
        setLoading(false)
      })
  }, [chainId])

  if (isLoading) return <p>Loading...</p>
  if (!lists) return <p>No lists data</p>

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="flex flex-row justify-around">
          <Card />
          <Card />
          <Card />
        </div>
        <div className="py-4">
          <table className="min-w-full md:rounded-lg overflow-hidden border-spacing-0">
            <thead className="bg-gray-100">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Merchant
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Volume
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Limit
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  &nbsp;
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {lists.map(
                ({
                  id,
                  total_available_amount: amount,
                  seller: { address },
                  token: { decimals, symbol },
                  fiat_currency: { code, symbol: fiatSymbol },
                  limit_min: min,
                  limit_max: max
                }) => (
                  <tr key={id} className="hover:bg-gray-50">
                    <td className="pl-4 py-4">
                      <div className="text-sm text-gray-900">{address}</div>
                      <div className="mt-1 flex flex-col text-gray-500 sm:block lg:hidden">
                        <span>Volume: 0.0212 BTC</span>
                        <br />
                        <span>
                          Amount: {formatUnits(amount, decimals)} {symbol}
                        </span>
                      </div>
                    </td>
                    <td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
                      0.0212 BTC
                    </td>
                    <td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
                      {formatUnits(amount, decimals)} {symbol}
                    </td>
                    <td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
                      {fiatSymbol} {min} - {fiatSymbol}
                      {max}
                    </td>
                    <td className="text-right py-4 pr-4">
                      <Button title="Buy" />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  return {
    props: { title: "P2P" } // will be passed to the page component as props
  }
}

export default HomePage
