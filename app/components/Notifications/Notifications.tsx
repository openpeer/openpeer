import { useNotifications } from 'hooks';
import React, { Fragment, useEffect, useState } from 'react';

import { Transition } from '@headlessui/react';
import { BellIcon, BellSnoozeIcon } from '@heroicons/react/24/outline';

import NotificationDetail from './NotificationDetail';

const Notifications = () => {
	const [open, setOpen] = useState(false);

	const { notifications, anyUnseen, markAsRead, markAsArchived, markAllAsSeen } = useNotifications();

	useEffect(() => {
		if (open) {
			markAllAsSeen();
		}
	}, [open]);

	return (
		<>
			<button
				type="button"
				className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				onClick={() => setOpen(!open)}
			>
				<span className="sr-only">View notifications</span>
				<BellIcon className="h-6 w-6" aria-hidden="true" />
				{anyUnseen && (
					<span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-400 ring-2 ring-white" />
				)}
			</button>
			{open && (
				<div
					aria-live="assertive"
					className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 mt-6 z-50 cursor-pointer"
				>
					<div className="flex w-full flex-col items-center space-y-4 sm:items-end">
						<Transition
							show={open}
							as={Fragment}
							enter="transform ease-out duration-300 transition"
							enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
							enterTo="translate-y-0 opacity-100 sm:translate-x-0"
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
								{notifications.length === 0 ? (
									<div className="p-4">
										<div className="flex flex-row items-center">
											<BellSnoozeIcon className="h-8 w-8 text-cyan-700" aria-hidden="true" />
											<p className="pl-2">You have no notifications</p>
										</div>
									</div>
								) : (
									notifications.map((notification) => (
										<NotificationDetail
											key={notification.id}
											notification={notification}
											onOpen={markAsRead}
											onDismiss={markAsArchived}
										/>
									))
								)}
							</div>
						</Transition>
					</div>
				</div>
			)}
		</>
	);
};

export default Notifications;
