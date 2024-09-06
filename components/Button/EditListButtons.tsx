import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { useConfirmationSignMessage, useAccount } from 'hooks';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { List } from 'models/types';
import snakecaseKeys from 'snakecase-keys';
import Select from 'components/Select/Select';
import { Option } from 'components/Select/Select.types';
import { toast } from 'react-toastify';

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
		{ id: 3, name: 'Share Ad' },
		{ id: 4, name: status === 'created' ? 'Show Ad' : 'Hide Ad' },
		{ id: 5, name: 'Delete Ad' }
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
			// Handle the share ad option
			const shareUrl = `${window.location.origin}/buy/${encodeURIComponent(id)}`;
			navigator.clipboard.writeText(shareUrl).then(() => {
				toast.success('Ad URL copied to clipboard!');
			});
		} else if (o.id === 4) {
			signListStatusChange({ message: toggleMessage });
		} else if (o.id === 5) {
			signMessage({ message: `I want to delete the list ${id}` });
		}
	};

	return (
		<div className="w-full flex flex-row px-4 md:px-0 items-center space-x-2 lg:justify-center">
			<Select extraStyle="w-full" label="" options={options} selected={option} onSelect={updateOption} />
		</div>
	);
};

export default EditListButtons;
