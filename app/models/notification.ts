

export interface Notification {
	id: string;
	title?: string;
	description?: string;
	unseen: boolean;
	unread: boolean;
	url?: string;
	status: 'active' | 'inactive';
}

export interface NotificationParams {
	notification: Notification;
	onOpen: (id: string) => void;
	onDismiss: (id: string) => void;
}
