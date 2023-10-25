import { Verification } from 'models/verification';

import type { NextApiRequest, NextApiResponse } from 'next';
import { synapsApi } from './utils/utils';

const createVerification = async (alias: string): Promise<Verification> => {
	const { data } = await synapsApi.post(`/session/init?alias=${alias}`);
	return data;
};

const fetchVerifications = async (alias: string): Promise<Verification[]> => {
	const { data } = await synapsApi.get('/session/alias', { params: { alias } });
	return data || [];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Verification>) {
	const { alias } = req.query;
	try {
		const [existingSession] = await fetchVerifications(alias as string);
		const result = existingSession || (await createVerification(alias as string));
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json({} as Verification);
	}
}
