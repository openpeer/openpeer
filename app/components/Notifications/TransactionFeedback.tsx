import React, { Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { ArrowTopRightOnSquareIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import Avatar from 'components/Avatar';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';

export interface ModalProps {
	TransactionType: 'error' | 'success';
	open: boolean;
	onClose: () => void;
	onAction: () => void;
}

const TransactionFeedback = ({ TransactionType, open, onClose, onAction }: ModalProps) => {
	const confirmAction = () => {
		onAction();
		onClose();
	};
	const { data: session } = useSession();
	const user = session?.user as User;

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={onClose}>
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
												onClick={confirmAction}
											/>
										</span>
										<Avatar user={user} className="w-5 md:w-10 aspect-square mb-2 mt-4" />
										<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
											{user.name}
										</Dialog.Title>
									</div>
									<div className="p-4">
										<div className="mt-2 mb-4">
											<div className="text-sm text-gray-500">Recent Transactions</div>
										</div>
										{TransactionType === 'error' ? (
											<div className="flex flex-row items-center space-x-2">
												<div>
													<XCircleIcon
														className="w-5 h-5 text-red-600 font-bold"
														aria-hidden="true"
													/>
												</div>
												<div className="text-base">
													<span className="text-base">Cancelled the order</span>
													<span className="text-base">Confirmed</span>
												</div>
											</div>
										) : (
											<div className="flex flex-row items-center space-x-2">
												<div>
													<CheckCircleIcon
														className="w-5 h-5 text-blue-600 font-bold"
														aria-hidden="true"
													/>
												</div>
												<div className="flex flex-col text-base">
													<span className="text-base">Cancelled the order</span>
													<span className="text-xs text-blue-600">Confirmed</span>
												</div>
											</div>
										)}
										<div className="mt-6 mb-2 flex flex-row justify-between">
											<span className="text-xs">View more on Explorer</span>
											<span className="text-xs">
												<ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-500" />
											</span>
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

export default TransactionFeedback;
