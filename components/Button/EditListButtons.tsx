import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { PencilSquareIcon, TrashIcon, EyeSlashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useConfirmationSignMessage, useAccount } from 'hooks';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { List } from 'models/types';
import snakecaseKeys from 'snakecase-keys';
import Select from 'components/Select/Select';
import { Option } from 'components/Select/Select.types';

const EditListButtons = ({ list }: { list: List }) => {
	const { id, status } = list;
	const router = useRouter();
	const { address } = useAccount();
	const updateList = { ...list, status: status === 'created' ? 'active' : 'created' };
	const toggleMessage = JSON.stringify(snakecaseKeys(updateList, { deep: true }), undefined, 4);
	const [option, setOption] = useState<Option>();

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

	const options = [
		{ id: 1, name: 'Edit Ad' },
		{ id: 2, name: 'Deposit/Withdraw Funds' },
		{ id: 3, name: status === 'created' ? 'Hide Ad' : 'Show Ad' },
		{ id: 4, name: 'Delete Ad' }
	];

	const updateOption = (o: Option | undefined) => {
		setOption(o);
		if (!o) {
			return;
		}
		if (o.id === 1) {
			router.push(`/ads/${encodeURIComponent(id)}/edit`);
		} else if (o.id === 2) {
			router.push('/escrows');
		} else if (o.id === 3) {
			signListStatusChange({ message: toggleMessage });
		} else {
			signMessage({ message: `I want to delete the list ${id}` });
		}
	};

	return (
		<div className="flex flex-row items-center space-x-2 lg:justify-center">
			<Select label="" options={options} selected={option} onSelect={updateOption} />

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
