import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline';
import { Loading, Steps } from 'components';
import { Amount, PaymentMethod, Summary } from 'components/Buy';
import { UIOrder } from 'components/Buy/Buy.types';
import WrongNetwork from 'components/WrongNetwork';
import { useConnection, useListPrice } from 'hooks';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const AMOUNT_STEP = 1;
const PAYMENT_METHOD_STEP = 2;

const BuyPage = ({ id }: { id: number }) => {
	const [order, setOrder] = useState<UIOrder>({ step: AMOUNT_STEP } as UIOrder);
	const [showFilters, setShowFilters] = useState(false);
	const { step = AMOUNT_STEP, list } = order;
	const { price } = useListPrice(list);
	const { address } = useAccount();
	const { wrongNetwork, status } = useConnection();

	useEffect(() => {
		fetch(`/api/lists/${id}`)
			.then((res) => res.json())
			.then((data) => {
				setOrder({
					...order,
					...{ list: data, listId: data.id }
				});
			});
	}, [id]);

	useEffect(() => {
		setOrder({ ...order, ...{ price } });
	}, [price]);

	const seller = order.seller || order.list?.seller;
	const canBuy = seller && seller.address !== address;

	if (wrongNetwork) return <WrongNetwork />;
	if (status === 'loading' || !list || !canBuy) return <Loading />;

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
					{step === PAYMENT_METHOD_STEP && <PaymentMethod order={order} updateOrder={setOrder} />}
				</div>
				<div className="hidden lg:contents">{!!order.list && <Summary order={order} />}</div>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) =>
	// Pass data to the page via props
	({ props: { title: 'Trade', id: String(context.params?.id) } });
export default BuyPage;
