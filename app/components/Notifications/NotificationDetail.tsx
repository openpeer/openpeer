import { NotificationParams } from 'models/notification';
import { useRouter } from 'next/router';

import { XMarkIcon } from '@heroicons/react/20/solid';
import { InboxIcon } from '@heroicons/react/24/outline';

const NotificationDetail = ({ notification, onOpen, onDismiss }: NotificationParams) => {
	const { id, title, description, unseen, unread, url } = notification;
	const router = useRouter();
	const onClick = () => {
		onOpen(id);
		if (url) {
			router.push(url);
		}
	};

	return (
		<div className={`p-4 ${!unread && 'bg-slate-900'}`} onClick={onClick}>
			<div className="flex items-start">
				<div className="flex-shrink-0">
					<InboxIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
				</div>
				<div className="ml-3 w-0 flex-1 pt-0.5">
					<p className="text-left text-sm font-medium text-gray-900">{title}</p>
					<p className="mt-1 text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: description! }}></p>
					<div className="mt-3 flex space-x-7">
						<button
							type="button"
							className="rounded-md bg-white text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							onClick={() => onClick}
						>
							See details
						</button>
						<button
							type="button"
							className="rounded-md bg-white text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							onClick={() => onDismiss(id)}
						>
							Dismiss
						</button>
					</div>
				</div>
				<div className="ml-4 flex flex-shrink-0">
					<button
						type="button"
						className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						onClick={() => onDismiss(id)}
					>
						<span className="sr-only">Close</span>
						<XMarkIcon className="h-5 w-5" aria-hidden="true" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default NotificationDetail;
