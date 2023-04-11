import { Verification } from 'models/verification';

import { synapsApi } from './utils/utils';

import type { NextApiRequest, NextApiResponse } from 'next';
const createVerification = async (alias: string): Promise<Verification> => {
	const { data } = await synapsApi.post('/session/init?alias=' + alias);
	return data;
};

const fetchVerifications = async (alias: string): Promise<Verification[]> => {
	const { data } = await synapsApi.get('/session/alias?alias=' + alias);
	return data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Verification>) {
	const { alias } = req.query;
	try {
		const [existingSession] = await fetchVerifications(alias as string);
		const result = existingSession || (await createVerification(alias as string));
		res.status(200).json(result);
	} catch (err) {
		console.error(err);
		res.status(500);
	}
}