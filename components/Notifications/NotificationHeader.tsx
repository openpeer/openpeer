/* eslint-disable @typescript-eslint/indent */
import Link from 'next/link';
import React from 'react';

import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface NotificationHeaderProps {
	message: string;
	type?: 'info' | 'error' | 'success';
	detailsLink: string;
}

const NotificationHeader = ({ message, detailsLink, type = 'info' }: NotificationHeaderProps) => (
	<div
		className={
			type === 'error'
				? 'rounded-md bg-red-50 p-4 my-4 mx-8 text-red-700'
				: type === 'success'
				? 'rounded-md bg-green-50 p-4 my-4 mx-8 text-green-800'
				: 'rounded-md bg-blue-50 p-4 my-4 mx-8 text-blue-700' // info
		}
	>
		<div className="flex">
			<div className="flex-shrink-0">
				<InformationCircleIcon className="h-5 w-5" aria-hidden="true" />
			</div>
			<div className="ml-3 flex-1 md:flex md:justify-between">
				<p className="text-sm">{message}</p>
				<p className="mt-3 text-sm md:mt-0 md:ml-6">
					<Link href={detailsLink} className="whitespace-nowrap font-medium hover:text-gray-800">
						Details
						<span aria-hidden="true"> &rarr;</span>
					</Link>
				</p>
			</div>
		</div>
	</div>
);

export default NotificationHeader;
