import { Token } from 'models/types';
import React, { Fragment, useEffect, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { Manrope } from '@next/font/google';
import TokenImage from 'components/Token/Token';
import Input from 'components/Input/Input';
import Button from 'components/Button/Button';
import { formatUnits, isAddress } from 'viem';

const manrope = Manrope({
	subsets: ['latin'],
	variable: '--font-manrope'
});

export interface SendFundsModalProps {
	open: boolean;
	onClose: () => void;
	token: Token | undefined;
	balance: bigint | undefined;
}

const SendFundsModal = ({ open, onClose, token, balance = BigInt(0) }: SendFundsModalProps) => {
	const [address, setAddress] = useState('');
	const [amount, setAmount] = useState<number>();

	useEffect(() => {
		setAddress('');
		setAmount(undefined);
	}, [token]);

	if (!token) return <></>;

	const maxAmount = Number(formatUnits(balance, token.decimals));

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className={`relative z-10 ${manrope.className}`} onClose={onClose}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-lg">
								<div>
									<div className="w-full flex flex-col items-center text-center p-4">
										<span className="absolute right-3 top-3 bg-gray-200 rounded-full p-2 cursor-pointer">
											<XMarkIcon
												className="w-4 h-4 text-gray-500"
												aria-hidden="true"
												onClick={onClose}
											/>
										</span>
									</div>
									<div className="p-8">
										<div className="mt-2 mb-4">
											<div className="text-lg font-bold text-center">Send Funds</div>
											<span className="text-base font-medium text-gray-700">Token</span>
											<div className="mt-2">
												<div className="flex flex-row items-center space-x-2">
													<TokenImage token={token} size={32} />
													<span>{token.name}</span>
												</div>
											</div>

											<Input
												id="address"
												label="Address"
												placeholder="0x..."
												value={address}
												onChange={setAddress}
												error={!!address && !isAddress(address) ? 'Invalid address' : undefined}
											/>
											<Input
												id="amount"
												label="Amount"
												placeholder="10"
												decimalScale={token.decimals}
												type="decimal"
												value={amount}
												onChangeNumber={setAmount}
												addOn={
													<span
														className="cursor-pointer text-sm"
														onClick={() => setAmount(maxAmount)}
													>
														MAX
													</span>
												}
												error={maxAmount < (amount || 0) ? 'Insufficient balance' : undefined}
											/>

											<div className="flex flex-row items-center space-x-4">
												<Button title="Cancel" outlined onClick={onClose} />
												<Button
													title="Send Funds"
													onClick={onClose}
													disabled={
														!isAddress(address) ||
														(amount || 0) <= 0 ||
														(amount || 0) > maxAmount
													}
												/>
											</div>
										</div>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default SendFundsModal;
