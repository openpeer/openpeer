import { DocumentIcon } from '@heroicons/react/24/outline';
import Button from 'components/Button/Button';
import Input from 'components/Input/Input';
import Label from 'components/Label/Label';
import Textarea from 'components/Textarea/Textarea';
import { useFormErrors } from 'hooks';
import { Errors } from 'models/errors';
import { Order } from 'models/types';
import Image from 'next/image';
import { useState } from 'react';
import snakecaseKeys from 'snakecase-keys';
import { useContractRead } from 'wagmi';
import OpenPeerEscrow from '../../abis/OpenPeerEscrow.json';

import FilesUploader from './FilesUploader';

interface Upload {
	key: string;
	signedURL: string;
	filename: string;
}

const DisputeClaim = ({ order, address }: { order: Order; address: `0x${string}` }) => {
	const { uuid, buyer, dispute, escrow } = order;
	const { seller_comment: sellerComment, buyer_comment: buyerComment, dispute_files: files } = dispute;
	const isBuyer = buyer.address === address;
	const [comments, setComments] = useState((isBuyer ? buyerComment : sellerComment) || '');
	const orderUploads: Upload[] = files.map((file) => {
		return {
			signedURL: file.upload_url,
			key: file.key,
			filename: file.filename
		};
	});

	const [uploads, setUploads] = useState<Upload[]>(orderUploads);
	const { errors, clearErrors, validate } = useFormErrors();

	const { data: paidForDispute, isFetching } = useContractRead({
		address: escrow.address,
		abi: OpenPeerEscrow,
		functionName: 'paidForDispute',
		args: [address]
	});

	const onUploadFinished = (newUploads: Upload[]) => {
		setUploads([...newUploads, ...uploads]);
	};

	const onChangeComments = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		clearErrors(['comments']);
		setComments(event.target.value);
	};

	const resolver = () => {
		const error: Errors = {};
		if (!comments) {
			error.comments = 'Should be present';
		}

		if (uploads.length === 0) {
			error.uploads = 'Add some evidence';
		}

		return error;
	};

	const onContinue = async () => {
		if (validate(resolver)) {
			const result = await fetch(`/api/orders/${uuid}/disputes`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(
					snakecaseKeys(
						{
							buyerComment: isBuyer ? comments : undefined,
							sellerComment: isBuyer ? undefined : comments,
							files: uploads.map(({ key }) => key)
						},
						{ deep: true }
					)
				)
			});

			const response = await result.json();
			console.log('response', response);
		}
	};

	return (
		<>
			<div>
				<Label title="Comments" />
				<Textarea
					rows={4}
					id="comments"
					value={comments}
					placeholder="Tell us more about the transaction"
					onChange={onChangeComments}
					errors={errors.comments}
				/>
			</div>
			<div>
				<Label title="Upload proof" />
				{uploads.length < 5 && (
					<div className="mb-8">
						<FilesUploader uuid={uuid} address={address} onUploadFinished={onUploadFinished} />
						{!!errors.uploads && <p className="mt-2 text-sm text-red-600">{errors.uploads}</p>}
					</div>
				)}
				{uploads.length > 0 && (
					<div className="flex flex-row items-center justify-center">
						{uploads.map(({ key, signedURL, filename }) => {
							const fileType = key.split('.').pop()?.toLowerCase();
							if (fileType === 'pdf') {
								return (
									<div
										className="rounded-md border flex flex-col items-center justify-center"
										key={key}
									>
										<DocumentIcon className="text-cyan-600 w-10" />
										<p className="text-xs text-grey-600 text-ellipsis overflow-hidden">
											{filename}
										</p>
									</div>
								);
							} else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType!)) {
								return (
									<Image
										key={key}
										unoptimized
										priority
										src={signedURL}
										alt={`Uploaded file ${key}`}
										width={143}
										height={136}
										className="rounded-md"
									/>
								);
							}

							return <p key={key}>Unsupported file type</p>;
						})}
					</div>
				)}
			</div>
			<div className="-mb-8">
				<Input label="Pay" disabled id="pay" value="1 MATIC" />
			</div>
			<div className="flex flex-col md:flex-row gap-x-8 items-center">
				<Button title="Cancel" outlined />
				<Button title="Continue" onClick={onContinue} />
			</div>
		</>
	);
};

export default DisputeClaim;
