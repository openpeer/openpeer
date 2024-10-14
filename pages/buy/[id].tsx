// pages/buy/[id].tsx

import { Loading, Steps } from 'components';
import { Amount, OrderPaymentMethod, Summary } from 'components/Buy';
import { UIOrder } from 'components/Buy/Buy.types';
import { useListPrice, useAccount } from 'hooks';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';

import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import BlockedUsers from 'components/BlockedUsers';
import { User } from 'models/types';
import useUserRelationships from 'hooks/useUserRelationships';

const AMOUNT_STEP = 1;
const PAYMENT_METHOD_STEP = 2;

const BuyPage = ({ id }: { id: number }) => {
	const [order, setOrder] = useState<UIOrder>({ step: AMOUNT_STEP } as UIOrder);
	const [showFilters, setShowFilters] = useState(false);
	const [isBlocked, setIsBlocked] = useState(false);
	const [blockedMessage, setBlockedMessage] = useState('');
	const { step = AMOUNT_STEP, list } = order;
	const { price } = useListPrice(list);
	const { address } = useAccount();

	// Logging the address for debugging
	useEffect(() => {
		console.log('BuyPage address:', address);
	}, [address]);

	const userRelationships = useUserRelationships(address);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const listResponse = await fetch(`/api/lists/${id}`, {
					headers: {
						Authorization: `Bearer ${getAuthToken()}`
					}
				}).then((res) => res.json());

				setOrder({
					...order,
					...{ list: listResponse, listId: listResponse.id }
				});

				const seller = listResponse.seller;
				console.log('Seller:', seller);

				if (!seller) {
					console.log('Seller information is not available yet.');
					return;
				}

				if (!userRelationships) {
					console.log('User relationships not loaded yet.');
					return;
				}

				const { blocked_users, blocked_by_users, trusted_by_users } = userRelationships;

				const sellerTrustsMe = trusted_by_users.some((user: User) => user.id === seller.id);

				if (blocked_users.some((user: User) => user.id === seller.id)) {
					console.log('User has blocked the seller.');
					setIsBlocked(true);
					setBlockedMessage(
						'You have blocked the owner of this offer. You can unblock them to proceed or you can choose another offer.'
					);
				} else if (blocked_by_users.some((user: User) => user.id === seller.id)) {
					console.log('Seller has blocked the user.');
					setIsBlocked(true);
					setBlockedMessage('The owner of this offer has blocked you. Please choose another offer.');
				} else if (listResponse.accept_only_trusted && !sellerTrustsMe) {
					console.log('Ad accepts only trusted users and the seller does not trust the current user.');
					setIsBlocked(true);
					setBlockedMessage('This ad is not available');
				} else {
					console.log('The seller trusts the current user.');
					setIsBlocked(false);
					setBlockedMessage('');
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		if (address && userRelationships) {
			fetchData();
		}
	}, [id, address, userRelationships]);

	useEffect(() => {
		setOrder({ ...order, ...{ price } });
	}, [price]);

	// Adjusted logic for checking seller
	const seller = list?.seller || order.seller;
	console.log('seller:', seller);
	const canBuy = seller && seller.address !== address;

	if (isBlocked) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
				<h2 className="text-2xl font-bold text-red-500 mb-4">Access Blocked</h2>
				<p className="text-lg text-gray-700 text-center">{blockedMessage}</p>
				{blockedMessage.includes('You have blocked the owner of this offer') && (
					<div className="mt-8 w-full max-w-2xl">
						<BlockedUsers
							acceptOnlyBlocked={true}
							setAcceptOnlyBlocked={() => {}}
							context="buy" // Use the new 'buy' context
						/>
					</div>
				)}
			</div>
		);
	}

	if (!list) return <Loading />;
	if (!canBuy) {
		return (
			<Loading
				spinner={false}
				message={order.seller ? 'You are not the seller of this order' : 'You are the seller of this ad'}
			/>
		);
	}

	const handleToggleFilters = () => {
		setShowFilters(!showFilters);
	};

	return (
		<div className="pt-4 md:pt-6">
			<div className="w-full flex flex-col md:flex-row px-4 sm:px-6 md:px-8 mb-16">
				<div className="w-full lg:w-2/4">
					<Steps
						currentStep={step}
						stepsCount={3}
						onStepClick={(n) => setOrder({ ...order, ...{ step: n } })}
					/>
					<div className="flex flex-row justify-end md:hidden md:justify-end" onClick={handleToggleFilters}>
						<AdjustmentsVerticalIcon
							width={24}
							height={24}
							className="text-gray-600 hover:cursor-pointer"
						/>
						<span className="text-gray-600 hover:cursor-pointer ml-2">Details</span>
					</div>
					{showFilters && <div className="mt-4">{!!order.list && <Summary order={order} />}</div>}
					{step === AMOUNT_STEP && <Amount order={order} updateOrder={setOrder} price={price} />}
					{step === PAYMENT_METHOD_STEP && <OrderPaymentMethod order={order} updateOrder={setOrder} />}
				</div>
				{!!order.list && <Summary order={order} />}
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) => ({
	props: { title: 'Trade', id: String(context.params?.id) }
});

export default BuyPage;
