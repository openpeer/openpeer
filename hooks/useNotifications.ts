import { Notification } from 'models/notification';
import { useEffect, useState } from 'react';
import useAccount from 'hooks/useAccount';

import Knock, { Feed, FeedEventPayload, FeedItem } from '@knocklabs/client';
import { getAuthToken, useDynamicContext } from '@dynamic-labs/sdk-react-core';

const useNotifications = () => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
	const [token, setToken] = useState('');
	const [client, setClient] = useState<Feed>();
	const { address } = useAccount();
	const { user } = useDynamicContext();

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
					const title = item?.data?.title;
					const description = block.rendered;
					const url = item?.data?.url;

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
		if (!address || !token) return;

		const knockClient = new Knock(process.env.NEXT_PUBLIC_KNOCK_API_KEY!);
		knockClient.authenticate(address, token); // Connect to the real-time socket

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
	}, [address, token]);

	useEffect(() => {
		const fetchToken = async () => {
			const response = await fetch('/api/knock', {
				headers: {
					Authorization: `Bearer ${getAuthToken()}`
				}
			});
			const { token: apiToken } = await response.json();
			setToken(apiToken);
		};

		if (user) fetchToken();
	}, [user]);

	const markAsRead = async (id: FeedItem['id']) => {
		const item = feedItems.find((i) => i.id === id);

		if (!!client && item) {
			await client.markAsRead(item);
			item.read_at = new Date().getTime().toString();
			item.seen_at = new Date().getTime().toString();
			processPayload({ items: [item] } as FeedEventPayload);
		}
	};

	const markAsArchived = async (id: FeedItem['id']) => {
		const item = feedItems.find((i) => i.id === id);

		if (!!client && item) {
			await client.markAsArchived(item);
			item.archived_at = new Date().getTime().toString();
			processPayload({ items: [item] } as FeedEventPayload);
		}
	};

	const markAllAsSeen = () => {
		if (client) {
			client.markAllAsSeen();
			setNotifications((n) => n.map((notification) => ({ ...notification, ...{ unseen: false } })));
		}
	};
	const activeNotifications = notifications.filter(({ status }) => status === 'active');
	const anyUnseen = activeNotifications.filter(({ unseen }) => unseen).length > 0;

	return { notifications: activeNotifications, anyUnseen, markAsRead, markAsArchived, markAllAsSeen };
};
export default useNotifications;
