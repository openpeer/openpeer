// components/FriendlyTime.tsx

import React from 'react';

interface FormattedTimeProps {
	timeInMinutes: number;
}

const FormattedTime: React.FC<FormattedTimeProps> = ({ timeInMinutes }) => {
	const hours = Math.floor(timeInMinutes / 60);
	const minutes = timeInMinutes % 60;

	if (hours > 0) {
		return (
			<span>
				{hours} {hours === 1 ? 'hour' : 'hours'}{' '}
				{minutes > 0 && `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`}
			</span>
		);
	}

	return (
		<span>
			{minutes} {minutes === 1 ? 'minute' : 'minutes'}
		</span>
	);
};

export default FormattedTime;
