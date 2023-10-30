import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { Button } from 'components';
import HeaderH3 from 'components/SectionHeading/h2';
import Select from 'components/Select/Select';
import { Option } from 'components/Select/Select.types';
import React from 'react';

const MyEscrow = () => (
	<>
		<div className="px-6 w-full flex flex-col items-center justify-center mt-4 pt-4 md:pt-6 text-gray-700">
			<div className="w-full md:w-1/2 flex flex-col mb-16">
				<HeaderH3 title="Deposit or Withdraw funds" />
				<div className="border border-slate-300 mt-4 p-4 rounded">
					<span>Begin by selecting the Chain</span>
					<div className="w-fit">
						<Select
							label="Chain"
							options={[]}
							selected={undefined}
							onSelect={function (option: Option | undefined): void {
								throw new Error('Function not implemented.');
							}}
						/>
					</div>
					<span>
						A new version of OpenPeer is available. Please withdraw your assets and deploy a new escrow
						contract
					</span>
					<div className="mt-4">
						<Button title="Deploying new contract" />
					</div>
				</div>
			</div>

			<div className="w-full md:w-1/2 flex flex-col mb-16">
				<HeaderH3 title="Deposit or Withdraw funds" />
				<div className="border border-slate-300 mt-4 p-4 rounded">
					<div>
						<div className="flex flex-row justify-between items-center">
							<div className="w-fit">
								<Select
									label="Chain"
									extraStyle="mt-2 mb-4"
									options={[]}
									selected={undefined}
									onSelect={function (option: Option | undefined): void {
										throw new Error('Function not implemented.');
									}}
								/>
							</div>
							<div className="flex flex-row bg-gray-100 text-gray-800 cursor-pointer p-2 space-x-2 rounded items-center">
								<span className="text-sm">Upadate</span>
								<span>
									<ArrowPathIcon className="w-4 h-4 text-gray-800" />
								</span>
							</div>
						</div>
					</div>
					<div className="mt-4">
						{/* <ListsTable lists={[]} /> */}
						<table className="w-full md:rounded-lg overflow-hidden">
							<thead className="bg-gray-100">
								<tr className="w-full relative">
									<th
										scope="col"
										className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
									>
										Token
									</th>
									<th
										scope="col"
										className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
									>
										Balance
									</th>
									<th
										scope="col"
										className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
									>
										Action
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 bg-white">
								<tr className="hover:bg-gray-50">
									<div className="mt-2 flex flex-col text-gray-500 lg:hidden">
										<div className="fw-full lex flex-col space-y-4">
											<span className="pr-2 text-sm">Token</span>
											<span>Balance</span>
											<span className="w-full flex flex-col space-y-4">
												<Button title="Deposit" />
												<Button title="Withdraw" />
											</span>
										</div>
									</div>
									<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
										() USDC
										<br />
										Polygon Mumbai
									</td>
									<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
										100 USDT
									</td>
									<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
										<div className="w-full flex flex-row space-x-4">
											<Button title="Deposit" />
											<Button title="Withdraw" />
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</>
);

export async function getServerSideProps() {
	return {
		props: { title: 'My Escrow' }
	};
}

export default MyEscrow;
