import { Loading, Steps } from 'components';
import { Amount, Summary } from 'components/Buy';
import { UIOrder } from 'components/Buy/Buy.types';
import WrongNetwork from 'components/WrongNetwork';
import { useConnection, useListPrice } from 'hooks';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const AMOUNT_STEP = 1;

const BuyPage = ({ id }: { id: number }) => {
	const [order, setOrder] = useState<UIOrder>({ step: AMOUNT_STEP } as UIOrder);
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

	return (
		<div className="pt-6">
			<div className="w-full flex flex-row px-4 sm:px-6 md:px-8 mb-16">
				<div className="w-full lg:w-2/4">
					<Steps currentStep={step} stepsCount={3} />
					{step === AMOUNT_STEP && <Amount order={order} updateOrder={setOrder} price={price} />}
				</div>
				{!!order.list && <Summary order={order} />}
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) =>
	// Pass data to the page via props
	 ({ props: { title: 'Trade', id: String(context.params?.id) } });
export default BuyPage;
