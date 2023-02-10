import React, { useEffect, useState } from 'react';

const MAX_FILE_SIZE = 1000000; // 1 MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const ImageUploader = ({ address }: { address: `0x${string}` }) => {
	const [file, setFile] = useState(null);
	const [error, setError] = useState(null);
	const [signedUrl, setSignedUrl] = useState('');

	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0];
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
		setError(null);
	};

	const handleUpload = (data) => {
		console.log('File uploaded successfully:', data);
	};

	useEffect(() => {
		if (file) {
			const formData = new FormData();
			formData.append('address', address);
			formData.append('file', file);
			fetch('/api/s3', {
				method: 'POST',
				body: formData,
				headers: {
					Accept: ALLOWED_FILE_TYPES.join(', ')
				}
			})
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					if (data.error) return;
					setSignedUrl(data);
				});
		}
	}, [file]);

	return (
		<div>
			<input type="file" accept={ALLOWED_FILE_TYPES.join(',')} multiple={false} onChange={handleFileChange} />
			{!!error && <p style={{ color: 'red' }}>{error}</p>}
		</div>
	);
};

export default ImageUploader;
