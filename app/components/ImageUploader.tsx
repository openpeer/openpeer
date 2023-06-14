import { S3 } from 'aws-sdk';
import React, { useEffect, useState } from 'react';

const MAX_FILE_SIZE = 1000000; // 1 MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

interface ImageUploaderParams {
	address: `0x${string}`;
	onUploadFinished?: (data: S3.ManagedUpload.SendData) => void;
}

const ImageUploader = ({ address, onUploadFinished }: ImageUploaderParams) => {
	const [file, setFile] = useState<File>();
	const [error, setError] = useState('');
	const [isUploading, setIsUploading] = useState(false);

	const handleFileChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
		if (!target.files) return;
		const selectedFile = target.files[0];
		if (!selectedFile) {
			return;
		}
		if (selectedFile.size > MAX_FILE_SIZE) {
			setError('File size exceeds 1 MB');
			return;
		}
		if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
			setError('File type must be jpeg, png, or gif');
			return;
		}
		setFile(selectedFile);
		setError('');
	};

	useEffect(() => {
		if (file) {
			setIsUploading(true);
			const formData = new FormData();
			formData.append('address', address);
			formData.append('file', file);
			fetch('/api/s3/profiles', {
				method: 'POST',
				body: formData,
				headers: {
					Accept: ALLOWED_FILE_TYPES.join(', ')
				}
			})
				.then((res) => res.json())
				.then(({ data }) => {
					setIsUploading(false);
					if (data.error) {
						setError(data.error);
					} else {
						onUploadFinished?.(data);
					}
				});
		}
	}, [file]);

	return (
		<div>
			<label
				htmlFor="file-input"
				className="w-full px-2 py-2.5 rounded border border-cyan-600 text-base text-cyan-600 hover:bg-cyan-600 hover:text-white my-8 cursor-pointer"
			>
				{isUploading ? 'Uploading...' : 'Upload'}
			</label>
			<input
				type="file"
				id="file-input"
				className="hidden"
				accept={ALLOWED_FILE_TYPES.join(',')}
				multiple={false}
				onChange={handleFileChange}
				disabled={isUploading}
			/>
			{!!error && <p style={{ color: 'red' }}>{error}</p>}
		</div>
	);
};

export default ImageUploader;
