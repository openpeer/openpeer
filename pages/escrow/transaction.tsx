import React from 'react';
import { Button, HeaderH3, Input, Switcher } from 'components';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import ClipboardText from 'components/Buy/ClipboardText';

const EscrowTransaction = () => (
	<>
		<div className="px-6 w-full flex flex-col items-center mt-4 pt-4 md:pt-6 text-gray-700 relative">
			<div className="w-full md:w-1/2 flex flex-col justify-between mb-16">
				<a href="/escrow" className="flex flex-row space-x-4 items-center mb-2">
					<ArrowLeftIcon className="w-4 h-4" /> <span className="text-sm">Back to Escrow</span>
				</a>
				<div className="flex flex-row justify-between items-center">
					<HeaderH3 title="Deposit or Withdraw funds" />
					<Switcher leftLabel="Deposit" rightLabel="Withdraw" selected={''} onToggle={''} />
				</div>
				<div className="flex flex-col border border-slate-300 mt-4 p-4 rounded">
					<div className="font-bold text-xl mb-2">Deposit USDT</div>
					<div className="text-sm">
						Deposit USDT into your Escrow Contract. The amount you deposit will be available for other
						traders to buy. You will have to acknowledge receipt of funds before escrowed crypto is released
						on any trade.
					</div>
					<div className="flex flex-row justify-between text-sm py-4 border-b border-gray-200">
						<span>Network</span>
						<span>Polygon</span>
					</div>
					<div className="flex flex-row justify-between text-sm py-4 border-b border-gray-200">
						<span>Asset</span>
						<span>USDC</span>
					</div>
					<Input label="Deposit amount" id={''} />
					<div>
						<Button title="Deposit" />
						<span className="text-sm">Funds can be withdrawn at any time</span>
					</div>
					<div className="font-bold text-xl mb-2">Or deposit from your exchange</div>
					<div className="flex flex-row">
						<div>QRCODE QRCODE QRCODE QRCODE</div>
						<div>
							<div>
								<span className="text-sm">USDT Address</span>
								<ClipboardText extraStyle="text-sm" itemValue={'AC32BiwPnQGtvNkQ9WVR9y6vLd222FUf3'} />
							</div>
							<div className="flex flex-row">
								<span>Polygon</span>
								<span>Only deposit on Polygon network otherwise funds will be lost</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</>
);

export async function getServerSideProps() {
	return {
		props: { title: 'Transactions' }
	};
}

export default EscrowTransaction;
