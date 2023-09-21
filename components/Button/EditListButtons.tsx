import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { PencilSquareIcon, TrashIcon, EyeSlashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useConfirmationSignMessage } from 'hooks';
import { getAuthToken } from '@dynamic-labs/sdk-react';
import { List } from 'models/types';
import snakecaseKeys from 'snakecase-keys';
import { useAccount } from 'wagmi';

const EditListButtons = ({ list }: { list: List }) => {
	const { id, status } = list;
	const router = useRouter();
	const { address } = useAccount();
	const updateList = { ...list, status: status === 'created' ? 'active' : 'created' };
	const toggleMessage = JSON.stringify(snakecaseKeys(updateList, { deep: true }), undefined, 4);

	const { signMessage } = useConfirmationSignMessage({
		onSuccess: async () => {
			await fetch(
				`/api/lists/${id}`,

				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${getAuthToken()}`
					}
				}
			);
			router.reload();
		}
	});

	const { signMessage: signListStatusChange } = useConfirmationSignMessage({
		onSuccess: async (data, variables) => {
			await fetch(
				`/api/lists/${id}`,

				{
					method: 'PUT',
					body: JSON.stringify(
						snakecaseKeys(
							{
								chainId: list.chain_id,
								list: updateList,
								data,
								address,
								message: variables.message
							},
							{ deep: true }
						)
					),
					headers: {
						Authorization: `Bearer ${getAuthToken()}`
					}
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
				className={`${status === 'created' ? 'bg-cyan-400' : 'bg-gray-400'} rounded p-1.5 cursor-pointer`}
				onClick={() => signListStatusChange({ message: toggleMessage })}
			>
				{status === 'created' ? (
					<EyeIcon width={20} height={20} color="white" />
				) : (
					<EyeSlashIcon width={20} height={20} color="white" />
				)}
			</div>
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
