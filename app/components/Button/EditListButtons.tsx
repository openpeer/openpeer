import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useConfirmationSignMessage } from 'hooks';

const EditListButtons = ({ id }: { id: number }) => {
	const router = useRouter();

	const { signMessage } = useConfirmationSignMessage({
		onSuccess: async () => {
			await fetch(
				`/api/lists/${id}`,

				{
					method: 'DELETE'
				}
			);
			router.reload();
		}
	});
	return (
		<div className="flex flex-row items-center space-x-2 lg:justify-center">
			<Link href={{ pathname: `/ads/${encodeURIComponent(id)}/edit` }}>
				<div className="bg-cyan-600 rounded p-1.5">
					<PencilSquareIcon width={20} height={20} color="white" />
				</div>
			</Link>
			<div
				className="bg-red-400 rounded p-1.5 cursor-pointer"
				onClick={() => signMessage({ message: `I want to delete the list ${id}` })}
			>
				<TrashIcon width={20} height={20} color="white" />
			</div>
		</div>
	);
};

export default EditListButtons;
