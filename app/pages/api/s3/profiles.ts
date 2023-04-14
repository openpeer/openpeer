import S3 from 'aws-sdk/clients/s3';
// @ts-ignore
import formidable from 'formidable';
import fs from 'fs';

import type { NextApiRequest, NextApiResponse } from 'next';

const s3 = new S3({
	apiVersion: '2006-03-01',
	region: process.env.AWS_REGION
});

interface AWSSignedUrlParams {
	data?: S3.ManagedUpload.SendData;
	error?: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse<AWSSignedUrlParams>) => {
	try {
		if (req.method === 'POST') {
			const data: { fields: any; files: any } = await new Promise((resolve, reject) => {
				const form = new formidable.IncomingForm();

				form.parse(req, (err: any, fields: any, files: any) => {
					if (err) reject({ err });
					resolve({ fields, files });
				});
			});
			const { file } = data.files;
			const fileContent = fs.readFileSync(file.filepath);
			const params = {
				Bucket: process.env.AWS_IMAGES_BUCKET!,
				Key: `${data.fields.address}.${file.originalFilename.split('.').pop()}`,
				Body: fileContent
			};

			const uploadData = await s3.upload(params).promise();
			return res.status(200).json({ data: uploadData });
		}
		// Handle any other HTTP method
		res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Error uploading the selected image' });
	}
};

export const config = {
	api: {
		bodyParser: false
	}
};

export default handler;
