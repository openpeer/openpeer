import { getAuthToken as evmGetAuthToken } from '@dynamic-labs/sdk-react';

const getAuthToken = () => {
	const token = evmGetAuthToken();

	if (token) {
		return token;
	}

	return localStorage.getItem('openpeer_authentication_token') || '';
};

export default getAuthToken;
