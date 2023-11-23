import React, { Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { Manrope } from '@next/font/google';

export interface ModalProps {
	children: React.ReactNode;
	open: boolean;
	onClose: () => void;
}

const manrope = Manrope({
	subsets: ['latin'],
	variable: '--font-manrope'
});

const Modal = ({ children, open, onClose }: ModalProps) => (
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
				<div className="flex min-h-full items-center justify-center p-4 text-center">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white p-4 text-left shadow-xl transition-all w-full max-w-lg sm:p-6">
							{children}
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</div>
		</Dialog>
	</Transition.Root>
);

export default Modal;
