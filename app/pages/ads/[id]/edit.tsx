import { Loading, Steps, WrongNetwork } from 'components';
import { Amount, Details, PaymentMethod, Summary } from 'components/Listing';
import { UIList } from 'components/Listing/Listing.types';
import { Option } from 'components/Select/Select.types';
import { List } from 'models/types';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { polygon } from 'wagmi/chains';

const AMOUNT_STEP = 1;
const PAYMENT_METHOD_STEP = 2;
const DETAILS_STEP = 3;

const EditTrade = ({ id }: { id: number }) => {
	const [list, setList] = useState<List>();
	const [uiList, setUiList] = useState<UIList>();
	const { chain, chains } = useNetwork();
	const { address } = useAccount();
	const chainId = chain?.id || chains[0]?.id || polygon.id;
	const { data: session } = useSession();

	useEffect(() => {
		fetch(`/api/lists/${id}`)
			.then((res) => res.json())
			.then((data: List) => {
				const {
					fiat_currency: fiatCurrency,
					token,
					margin_type: marginType,
					total_available_amount: totalAvailableAmount,
					limit_min: limitMin,
					limit_max: limitMax,
					bank,
					payment_method: paymentMethod,
					margin,
					deposit_time_limit: depositTimeLimit,
					terms
				} = data;
				setList(data);
				const currency = {
					...fiatCurrency,
					name: fiatCurrency.code
				} as Option;
				const ui: UIList = {
					...data,
					step: 1,
					currency,
					tokenId: token.id,
					fiatCurrencyId: currency.id,
					marginType,
					totalAvailableAmount: Number(totalAvailableAmount),
					limitMin: limitMin ? Number(limitMin) : undefined,
					limitMax: limitMax ? Number(limitMax) : undefined,
					paymentMethod: paymentMethod || { bank, bankId: bank.id },
					quickSellSetupDone: true,
					terms: terms || '',
					margin: margin ? Number(margin) : undefined,
					depositTimeLimit: depositTimeLimit ? Number(depositTimeLimit) : 0
				};
				setUiList(ui);
			});
	}, [address, chainId]);

	if (address === undefined || list === undefined || uiList === undefined) {
		return <Loading />;
	}

	// @ts-expect-error
	if (!session || session.address !== address || list.seller.address !== address || list.chain_id !== chainId) {
		return <WrongNetwork />;
	}

	const { step } = uiList;

	return (
		<div className="py-6">
			<div className="w-full flex flex-col md:flex-row px-4 sm:px-6 md:px-8 mb-16 2xl:w-3/4 2xl:m-auto">
				<div className="lg:w-2/4">
					<Steps
						currentStep={step}
						stepsCount={2}
						onStepClick={(n) => setUiList({ ...uiList, ...{ step: n } })}
					/>
					{step === AMOUNT_STEP && <Amount list={uiList} updateList={setUiList} tokenAmount={undefined} />}
					{step === PAYMENT_METHOD_STEP && <PaymentMethod list={uiList} updateList={setUiList} />}
					{step === DETAILS_STEP && <Details list={uiList} updateList={setUiList} />}
				</div>
				<Summary list={uiList} />
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) => ({
	props: { title: 'Edit Ad', id: String(context.params?.id) }
});

export default EditTrade;
