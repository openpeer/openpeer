/* eslint-disable @typescript-eslint/indent */
import Avatar from 'components/Avatar';
import { User } from 'models/types';
import React, { Fragment, useEffect } from 'react';
import { smallWalletAddress } from 'utils';
import useAccount from 'hooks/useAccount';
import { useWaitForTransaction } from 'wagmi';

import { Dialog, Transition } from '@headlessui/react';
import { ArrowPathIcon, ArrowTopRightOnSquareIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { Manrope } from '@next/font/google';
import useNetwork from 'hooks/useNetwork';

const manrope = Manrope({
	subsets: ['latin'],
	variable: '--font-manrope'
});

export interface TransactionFeedbackProps {
	open: boolean;
	onClose: () => void;
	hash: `0x${string}` | undefined;
	description: string;
	onTransactionReplaced: (hash: `0x${string}`) => void;
}

const TransactionFeedback = ({ open, onClose, hash, description, onTransactionReplaced }: TransactionFeedbackProps) => {
	const { address } = useAccount();
	const { chain } = useNetwork();
	const { isError, isLoading, isSuccess } = useWaitForTransaction({
		hash,
		onReplaced: ({ transaction: { hash: newHash } }) => onTransactionReplaced(newHash)
	});

	useEffect(() => {
		if (isSuccess) {
			setTimeout(() => {
				onClose();
			}, 1500);
		}
	}, [isSuccess]);

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
									<div className="w-full flex flex-col items-center text-center bg-gray-100 p-4">
										<span className="absolute right-3 top-3 bg-gray-200 rounded-full p-2 cursor-pointer">
											<XMarkIcon
												className="w-4 h-4 text-gray-500"
												aria-hidden="true"
												onClick={onClose}
											/>
										</span>
										{address && (
											<>
												<Avatar
													user={{ address } as User}
													className="w-5 md:w-10 aspect-square mb-2 mt-4"
												/>
												<Dialog.Title
													as="h3"
													className="text-lg font-medium leading-6 text-gray-900"
												>
													{smallWalletAddress(address)}
												</Dialog.Title>
											</>
										)}
									</div>
									<div className="p-4">
										<div className="mt-2 mb-4">
											<div className="text-sm text-gray-500">Recent Transaction</div>
										</div>

										<div className="flex flex-row items-center space-x-2">
											<div>
												{isLoading ? (
													<ArrowPathIcon
														className="w-5 h-5 text-blue-600 font-bold animate-spin"
														aria-hidden="true"
													/>
												) : isError ? (
													<XCircleIcon
														className="w-5 h-5 text-red-600 font-bold"
														aria-hidden="true"
													/>
												) : (
													<CheckCircleIcon
														className="w-5 h-5 text-blue-600 font-bold"
														aria-hidden="true"
													/>
												)}
											</div>
											<div className="flex flex-col text-base">
												<span className="text-base">{description}</span>
												{isSuccess && <span className="text-xs text-blue-600">Confirmed</span>}
											</div>
										</div>
										{hash &&
											chain &&
											(chain.blockExplorers?.etherscan || chain.blockExplorers?.default) && (
												<a
													target="_blank"
													href={`${chain.blockExplorers.default.url}/tx/${hash}`}
													rel="noopener noreferrer"
												>
													<div className="mt-6 mb-2 flex flex-row justify-between">
														<span className="text-xs">
															View more on{' '}
															{chain.blockExplorers?.etherscan.name ||
																chain.blockExplorers.default.name}
														</span>
														<span className="text-xs">
															<ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-500" />
														</span>
													</div>
												</a>
											)}
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

export default TransactionFeedback;
