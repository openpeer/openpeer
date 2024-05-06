import React, { useEffect, useState } from 'react';

import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { User } from 'models/types';
import { useAccount } from 'hooks';
import { DEFAULT_DEPOSIT_TIME_LIMIT } from 'utils';
import { ListStepProps, UIList } from './Listing.types';
import StepLayout from './StepLayout';
import AccountInfo from './AccountInfo';

interface OptionProps {
	type: string;
	title: string;
	description: string;
	selected: boolean;
	onClick: (type: string) => void;
}

const Option = ({ type, title, description, selected, onClick }: OptionProps) => (
	<div
		className={`relative flex items-center p-4 cursor-pointer my-4 border rounded-lg ${
			selected ? ' border-gray-500' : ''
		}`}
		onClick={() => onClick(type)}
	>
		<div className="min-w-0 flex-1 text-sm pl-2">
			<label htmlFor={type}>
				<span className="font-bold text-gray-800">{title}</span>
				<p id={type} className="font-medium text-gray-500">
					{description}
				</p>
			</label>
		</div>
		<div className="ml-3 flex h-5 items-center">
			<input
				id={title}
				aria-describedby={title}
				type="radio"
				className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
				value={type}
				checked={selected}
			/>
		</div>
	</div>
);

const ListType = ({ updateList, list }: ListStepProps) => {
	const [type, setType] = useState<string>(list.type || 'SellList');
	const { address } = useAccount();
	const [user, setUser] = useState<User | null>();
	const escrowSetting = type === 'BuyList' ? 'manual' : 'instant';

	const onProceed = () => {
		updateList({
			...list,
			...{
				type: type as UIList['type'],
				escrowType: escrowSetting,
				depositTimeLimit: escrowSetting === 'instant' ? 0 : DEFAULT_DEPOSIT_TIME_LIMIT,
				step: list.step + 1
			}
		});
	};

	useEffect(() => {
		updateList({
			...list,
			...{
				type: type as UIList['type'],
				depositTimeLimit: escrowSetting === 'instant' ? 0 : DEFAULT_DEPOSIT_TIME_LIMIT,
				escrowType: escrowSetting
			}
		});
	}, [type, escrowSetting]);

	useEffect(() => {
		if (!address) return;

		fetch(`/api/users/${address}`, {
			headers: {
				Authorization: `Bearer ${getAuthToken()}`
			}
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.errors) {
					setUser(null);
				} else {
					setUser(data);
				}
			});
	}, [address]);

	if (!user?.email) {
		return <AccountInfo setUser={setUser} />;
	}

	return (
		<StepLayout onProceed={onProceed}>
			<h2 className="text-lg mt-12 mb-2">Are you buying or selling crypto?</h2>
			<fieldset className="mb-2">
				<Option
					type="SellList"
					title="Selling"
					description="I want to sell crypto that I have in exchange for fiat"
					onClick={setType}
					selected={type === 'SellList'}
				/>
				<Option
					type="BuyList"
					title="Buying"
					description="I want to buy crypto in exchange for fiat that I have"
					onClick={setType}
					selected={type === 'BuyList'}
				/>
			</fieldset>
		</StepLayout>
	);
};

export default ListType;
