import { configureServerSideSIWE } from 'connectkit-next-siwe';

export const siweServer = configureServerSideSIWE({
	session: {
		cookieName: 'openpeer-connectkit-next-siwe',
		password: process.env.SESSION_SECRET,
		cookieOptions: {
			secure: process.env.NODE_ENV === 'production'
		}
	}
});
