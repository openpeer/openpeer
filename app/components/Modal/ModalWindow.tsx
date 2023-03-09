import Button from 'components/Button/Button';
import { Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon, ExclamationTriangleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

export interface ModalProps {
	title: string;
	content: string;
	type: 'alert' | 'success' | 'confirmation';
	actionButtonTitle: string;
	open: boolean;
	onClose: () => void;
	onAction: () => void;
}

const ModalWindow = ({ title, content, type, actionButtonTitle, open, onClose, onAction }: ModalProps) => {
	const confirmAction = () => {
		onAction();
		onClose();
	};
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
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
								<div>
									<div>
										{type === 'confirmation' ? (
											<div className="mx-auto flex h-12 w-12 items-center justify-center">
												<QuestionMarkCircleIcon
													className="h-12 w-12 text-cyan-600"
													aria-hidden="true"
												/>
											</div>
										) : type === 'alert' ? (
											<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
												<ExclamationTriangleIcon
													className="h-6 w-6 text-red-600"
													aria-hidden="true"
												/>
											</div>
										) : (
											<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
												<CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
											</div>
										)}
									</div>
									<div className="mt-3 text-center sm:mt-5">
										<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
											{title}
										</Dialog.Title>
										<div className="mt-2">
											<p className="text-sm text-gray-500">{content}</p>
										</div>
									</div>
								</div>
								<div className="flex flex-col flex-col-reverse md:flex-row items-center justify-between sm:gap-3">
									<span className="w-full">
										<Button title="Cancel" outlined onClick={onClose} />
									</span>
									<span className="w-full">
										<Button title={actionButtonTitle} onClick={confirmAction} />
									</span>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default ModalWindow;
