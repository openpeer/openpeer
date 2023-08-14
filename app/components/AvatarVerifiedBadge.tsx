import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import React from 'react';

const AvatarVerifiedBadge = () => (
	<div className="pl-1 md:pl-2 text-sm text-gray-900 text-ellipsis overflow-hidden">
		<CheckBadgeIcon width="18" height="18" className="text-blue-600" />
	</div>
);
export default AvatarVerifiedBadge;
