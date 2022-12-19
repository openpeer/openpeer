import Button from '../../components/Button/Button';
import Merchant from '../../types/merchant';

const merchant: Merchant[] = [
  {
    id: 1,
    name: 'Josh Reyes',
    volume: '0.0212 BTC',
    amount: '₹520',
    avaliable: '0.02394BTC',
    limit: '₹ 200-₹300',
    price: '₹520'
  },
  {
    id: 2,
    name: 'Marcos Teixeira',
    volume: '0.0212 BTC',
    amount: '₹720',
    avaliable: '0.02394BTC',
    limit: '₹ 200-₹300',
    price: '₹520'
  },
  {
    id: 3,
    name: 'Marcos Teixeira',
    volume: '0.0212 BTC',
    amount: '₹20',
    avaliable: '0.02394BTC',
    limit: '₹ 100-₹200',
    price: '₹520'
  }
];

export default function HomePage() {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Replace with your content */}
        <div className="py-4">
          {/* Table structure START  */}
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
              {merchant.map(({ id, name, volume, amount, limit }) => (
                <tr key={id} className="hover:bg-gray-50">
                  <td className="pl-4 py-4">
                    <div className="text-sm text-gray-900">{name}</div>
                    <div className="mt-1 flex flex-col text-gray-500 sm:block lg:hidden">
                      <span>Volume: {volume}</span>
                      <span>Amount: {amount}</span>
                    </div>
                  </td>
                  <td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
                    {volume}
                  </td>
                  <td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
                    {amount}
                  </td>
                  <td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
                    {limit}
                  </td>
                  <td className="text-right py-4 pr-4">
                    <Button title="Buy" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Table structure END  */}
        </div>
        {/* /End replace */}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: { title: 'P2P' } // will be passed to the page component as props
  };
}
