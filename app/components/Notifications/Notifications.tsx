import { Notification } from 'models/notification';
import { Fragment, useEffect, useState } from 'react';

import { Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import Knock, { Feed, FeedEventPayload, FeedItem } from '@knocklabs/client';

import NotificationDetail from './NotificationDetail';

const Notifications = () => {
	const [open, setOpen] = useState(false);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
	const [client, setClient] = useState<Feed>();

	const processPayload = ({ items }: FeedEventPayload) => {
		// Concatenate the updated notifications with any existing notifications not in the payload
		setNotifications((n) => {
			// Use a set to efficiently check if a notification already exists
			const existingIds = new Set(n.map(({ id }) => id));

			const newNotifications: Notification[] = [];
			const updatedNotifications: Notification[] = [];
			const toBeUpdated: Notification[] = [];

			// Map each item in the payload to a notification object
			items.forEach((item) => {
				// If the notification already exists, merge its properties with the updated properties
				const unread = !item.read_at;
				const unseen = unread && !item.seen_at;
				const archived = !!item.archived_at;

				// Calculate the status field based on the archived field
				const status = (archived ? 'inactive' : 'active') as Notification['status'];

				if (existingIds.has(item.id)) {
					const existingNotification = n.find(({ id }) => id === item.id);
					updatedNotifications.push({
						...existingNotification,
						...({ unseen, unread, status } as Notification)
					});
				} else {
					// Extract the properties we need from the item
					const [block] = item.blocks;
					const title = item?.data?.['title'];
					const description = block.rendered;
					const url = item?.data?.['url'];

					// Create the notification object
					const notification: Notification = {
						id: item.id,
						title,
						description,
						unseen,
						unread,
						url,
						status
					};
					newNotifications.push(notification);
				}
			});
			const toBeUpdatedIds = new Set(updatedNotifications.map(({ id }) => id));
			n.forEach((item) => {
				if (toBeUpdatedIds.has(item.id)) {
					const updatedNotification = updatedNotifications.find(({ id }) => id === item.id);
					toBeUpdated.push(updatedNotification!);
				} else {
					toBeUpdated.push(item);
				}
			});

			return [...newNotifications, ...toBeUpdated];
		});

		// Filter out any items in the payload that already exist in feedItems
		setFeedItems((i) => [...i, ...items]);
	};

	useEffect(() => {
		const knockClient = new Knock(process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY!);
		knockClient.authenticate('marcos', undefined); // Connect to the real-time socket

		// Initialize the feed
		const feedClient = knockClient.feeds.initialize(process.env.NEXT_PUBLIC_KNOCK_FEED_ID!);
		feedClient.listenForUpdates();

		feedClient.on('items.received.*', processPayload);
		feedClient.on('items.*', processPayload);

		// Fetch the feed items
		feedClient.fetch({
			status: 'all',
			page_size: 10
		});

		setClient(feedClient);
	}, []);

	useEffect(() => {
		if (open && !!client) {
			client.markAllAsSeen();
			setNotifications((n) => n.map((notification) => ({ ...notification, ...{ unseen: false } })));
		}
	}, [open, client]);

	const markAsRead = async (id: FeedItem['id']) => {
		let item = feedItems.find((item) => item.id === id);

		if (!!client && item) {
			await client.markAsRead(item);
			item.read_at = new Date().getTime().toString();
			item.seen_at = new Date().getTime().toString();
			processPayload({ items: [item] } as FeedEventPayload);
		}
	};

	const markAsArchived = async (id: FeedItem['id']) => {
		console.log('markAsArchived', id);
		let item = feedItems.find((item) => item.id === id);

		if (!!client && item) {
			await client.markAsArchived(item);
			item.archived_at = new Date().getTime().toString();
			processPayload({ items: [item] } as FeedEventPayload);
		}
	};

	const activeNotifications = notifications.filter(({ status }) => status === 'active');
	const anyUnseen = activeNotifications.filter(({ unseen }) => unseen).length > 0;

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
			{open && activeNotifications.length > 0 && (
				<>
					<div
						aria-live="assertive"
						className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 mt-6 z-50"
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
									{notifications
										.filter(({ status }) => status === 'active')
										.map((notification) => (
											<NotificationDetail
												key={notification.id}
												notification={notification}
												onOpen={markAsRead}
												onDismiss={markAsArchived}
											/>
										))}
								</div>
							</Transition>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default Notifications;
