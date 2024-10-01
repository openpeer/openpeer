// utils/intercom.ts
import Intercom from '@intercom/messenger-js-sdk';

const APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID || '';

if (!APP_ID) {
	console.error('Intercom App ID is not defined in environment variables');
}

Intercom({
	app_id: APP_ID
});

export const bootIntercom = (userData: { email: string; user_id: string; created_at: number }) => {
	if (typeof window !== 'undefined' && window.Intercom) {
		window.Intercom('boot', {
			api_base: 'https://api-iam.intercom.io',
			app_id: APP_ID,
			...userData
		});
	} else {
		console.warn('Intercom is not initialized');
	}
};

export const updateIntercom = () => {
	if (typeof window !== 'undefined' && window.Intercom) {
		window.Intercom('update');
	} else {
		console.warn('Intercom is not initialized');
	}
};
