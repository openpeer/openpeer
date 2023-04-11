import axios from 'axios';

export const minkeApi = axios.create({
	baseURL: process.env.OPEN_PEER_API_URL,
	timeout: 15000,
	headers: {
		'Content-Type': 'application/json',
		'X-Access-Token': process.env.OPENPEER_API_KEY
	}
});

export const synapsApi = axios.create({
	baseURL: process.env.SYNAPS_API_URL,
	timeout: 15000,
	headers: {
		'Content-Type': 'application/json',
		'Client-Id': process.env.SYNAPS_CLIENT_ID,
		'Api-Key': process.env.SYNAPS_API_KEY
	}
});
