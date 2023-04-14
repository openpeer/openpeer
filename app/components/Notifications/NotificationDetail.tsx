import { NotificationParams } from 'models/notification';
import { useRouter } from 'next/router';

import { XMarkIcon } from '@heroicons/react/20/solid';
import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const NotificationDetail = ({ notification, onOpen, onDismiss }: NotificationParams) => {
	const { id, title, description, url, unread } = notification;
	const router = useRouter();
	const onClick = () => {
		onOpen(id);
		if (url) {
			router.push(url);
		}
	};

	const onDismissClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		onDismiss(id);
	};

	return (
		<div className="p-4" onClick={onClick}>
			<div className="flex items-start">
				<div className="flex-shrink-0">
					{unread ? (
						<InformationCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
					) : (
						<CheckCircleIcon className="h-6 w-6 text-cyan-600" aria-hidden="true" />
					)}
				</div>
				<div className="ml-3 w-0 flex-1 pt-0.5">
					<p className="text-left text-sm font-medium text-gray-900">{title}</p>
					<p className="text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: description! }} />
					<div className="mt-3 flex space-x-7">
						<button
							type="button"
							className="rounded-md bg-white text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							onClick={() => onClick}
						>
							See details
						</button>
					</div>
				</div>
				<div className="ml-4 flex flex-shrink-0">
					<button
						type="button"
						className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						onClick={onDismissClick}
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
