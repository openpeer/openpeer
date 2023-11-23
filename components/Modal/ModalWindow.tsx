import Button from 'components/Button/Button';
import React from 'react';

import { Dialog } from '@headlessui/react';
import { CheckIcon, ExclamationTriangleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Manrope } from '@next/font/google';
import Modal from '.';

export interface ModalProps {
	title: string | JSX.Element;
	content: string | JSX.Element;
	type: 'alert' | 'success' | 'confirmation';
	actionButtonTitle: string;
	open: boolean;
	onClose: () => void;
	onAction: () => void;
	actionDisabled?: boolean;
	icon?: string | JSX.Element;
	closeAfterAction?: boolean;
}

const manrope = Manrope({
	subsets: ['latin'],
	variable: '--font-manrope'
});

const ModalWindow = ({
	title,
	content,
	type,
	actionButtonTitle,
	open,
	onClose,
	onAction,
	actionDisabled = false,
	icon,
	closeAfterAction = true
}: ModalProps) => {
	const confirmAction = () => {
		onAction();
		if (closeAfterAction) onClose();
	};
	return (
		<Modal open={open} onClose={onClose}>
			<div>
				<div>
					{type === 'confirmation' ? (
						<div className="mx-auto flex h-12 w-12 items-center justify-center">
							{icon}
							<QuestionMarkCircleIcon className="h-12 w-12 text-cyan-600" aria-hidden="true" />
						</div>
					) : type === 'alert' ? (
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
							<ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
						</div>
					) : (
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
							<CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
						</div>
					)}
				</div>
				<div className="mt-3 text-center sm:mt-5">
					<Dialog.Title as="h3" className={`text-lg font-medium leading-6 text-gray-900 ${manrope.variable}`}>
						{title}
					</Dialog.Title>
					<div className="mt-2 mb-4 md:mb-0">
						<div className="text-sm text-gray-500">{content}</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col flex-col-reverse md:flex-row items-center justify-between sm:gap-3">
				<span className="w-full">
					<Button title="Cancel" outlined onClick={onClose} />
				</span>
				<span className="w-full">
					<Button title={actionButtonTitle} onClick={confirmAction} disabled={actionDisabled} />
				</span>
			</div>
		</Modal>
	);
};

export default ModalWindow;
