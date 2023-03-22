import Button from 'components/Button/Button';
import CancelOrderButton from 'components/Buy/CancelOrderButton/CancelOrderButton';
import OpenDisputeButton from 'components/Buy/OpenDisputeButton';
import ReleaseFundsButton from 'components/Buy/ReleaseFundsButton';
import Input from 'components/Input/Input';
import Label from 'components/Label/Label';
import Loading from 'components/Loading/Loading';
import Textarea from 'components/Textarea/Textarea';
import { useFormErrors } from 'hooks';
import { Errors } from 'models/errors';
import { Order } from 'models/types';
import Image from 'next/image';
import { useState } from 'react';
import snakecaseKeys from 'snakecase-keys';
import { useAccount } from 'wagmi';

import { DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';

import FilesUploader from './FilesUploader';

interface Upload {
	key: string;
	signedURL: string;
	filename: string;
}

interface DisputeFormParams {
	order: Order;
	address: `0x${string}`;
	paidForDispute: boolean;
}

const DisputeForm = ({ order, address, paidForDispute }: DisputeFormParams) => {
	const { uuid, dispute, buyer } = order;
	const { user_dispute, resolved } = dispute || {};
	const { comments: userComment, dispute_files: files = [] } = user_dispute || {};
	const { address: connectedAddress } = useAccount();
	const isBuyer = buyer.address === connectedAddress;

	const [comments, setComments] = useState(userComment || '');
	const orderUploads: Upload[] = files.map((file) => {
		return {
			signedURL: file.upload_url,
			key: file.key,
			filename: file.filename
		};
	});

	const [uploads, setUploads] = useState<Upload[]>(orderUploads);
	const { errors, clearErrors, validate } = useFormErrors();

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
		if (validate(resolver) && paidForDispute) {
			const result = await fetch(`/api/orders/${uuid}/disputes`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(
					snakecaseKeys(
						{
							comments,
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
					error={errors.comments}
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
					<div className="w-full flex flex-col md:flex-row space-x-2">
						{uploads.map(({ key, signedURL, filename }) => {
							const fileType = key.split('.').pop()?.toLowerCase();
							return (
								<div key={key} className="w-full md:w-1/3 mb-4 items-center justify-center relative">
									<div className="bg-gray-200 flex w-full h-full items-center justify-center rounded">
										{fileType === 'pdf' ? (
											<div className="flex flex-col items-center relative">
												<DocumentIcon className="text-cyan-600 w-10" />
												<p className="text-xs text-gray-600 break-all p-2">{filename}</p>
											</div>
										) : ['jpg', 'jpeg', 'png', 'gif'].includes(fileType!) ? (
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
										) : (
											<p key={key}>Unsupported file type</p>
										)}
										<button className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-cyan-600 ring-2 ring-white flex items-center justify-center cursor-pointer">
											<XMarkIcon className="w-8 h-8 text-white" />
										</button>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
			{!paidForDispute && (
				<div className="">
					<Input label="Pay" disabled id="pay" value="1 MATIC" />
				</div>
			)}
			<div className="flex flex-col md:flex-row gap-x-8 items-center">
				{!resolved &&
					(isBuyer ? (
						<CancelOrderButton order={order} title="Cancel" />
					) : (
						<Button title="Continue" onClick={onContinue} />
					))}
				{paidForDispute ? (
					<ReleaseFundsButton escrow={order.escrow!.address} outlined title="Cancel" dispute />
				) : (
					<OpenDisputeButton order={order} outlined={false} title="Open Dispute" />
				)}
			</div>
		</>
	);
};

export default DisputeForm;
