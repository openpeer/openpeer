// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_QUADRATA_API_URL}/login`, {
			method: 'POST',
			body: JSON.stringify({ apiKey: process.env.QUADRATA_API_KEY }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const result = await response.json();
		res.status(200).json(result.data);
	} catch (err) {
		res.status(500).json([]);
	}
}
