/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import S3 from 'aws-sdk/clients/s3';
// @ts-ignore
import formidable from 'formidable';
import fs from 'fs';

import type { NextApiRequest, NextApiResponse } from 'next';

const s3 = new S3({
	apiVersion: '2006-03-01',
	region: process.env.AWS_REGION
});

interface Upload {
	key: string;
	signedURL: string;
	filename: string;
}

interface AWSSignedUrlParams {
	data?: Upload[];
	error?: string;
}

const generateSignedUrl = async (key: string) => {
	const params = {
		Bucket: process.env.AWS_IMAGES_BUCKET!,
		Key: key,
		Expires: 60 // The URL will expire in 60 seconds
	};

	return s3.getSignedUrlPromise('getObject', params);
};

const handler = async (req: NextApiRequest, res: NextApiResponse<AWSSignedUrlParams>) => {
	try {
		if (req.method === 'POST') {
			const form = formidable({ multiples: true });
			const data: { fields: any; files: Record<string, formidable.File[]> } = await new Promise(
				(resolve, reject) => {
					form.parse(req, (err: any, fields: any, files: any) => {
						if (err) reject(err);
						resolve({ files, fields });
					});
				}
			);

			const uploads: Promise<S3.ManagedUpload.SendData>[] = [];
			const signedUrls: Upload[] = [];
			const { uuid, address } = data.fields;

			for (const file of Object.values(data.files).flat()) {
				const fileContent = fs.readFileSync(file.filepath);
				const key = `disputes/${uuid}/${address}/${file.originalFilename}`;
				const params = {
					Bucket: process.env.AWS_IMAGES_BUCKET!,
					Key: key,
					Body: fileContent
				};

				const upload = s3.upload(params).promise();
				uploads.push(upload);

				const signedURL = await generateSignedUrl(key);
				signedUrls.push({ key, signedURL, filename: file.originalFilename });
			}

			await Promise.all(uploads);
			return res.status(200).json({ data: signedUrls });
		}
		// Handle any other HTTP method
		return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
	} catch (err) {
		return res.status(500).json({ error: 'Error uploading the selected files' });
	}
};

export const config = {
	api: {
		bodyParser: false
	}
};

export default handler;
