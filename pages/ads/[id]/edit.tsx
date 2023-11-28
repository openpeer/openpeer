import getAuthToken from 'utils/getAuthToken';
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';
import { Loading, Steps } from 'components';
import { Amount, Details, PaymentMethod, Summary } from 'components/Listing';
import { UIList } from 'components/Listing/Listing.types';
import { Option } from 'components/Select/Select.types';
import { List } from 'models/types';
import { GetServerSideProps } from 'next';
import ErrorPage from 'next/error';
import React, { useEffect, useState } from 'react';
import useAccount from 'hooks/useAccount';

const AMOUNT_STEP = 1;
const PAYMENT_METHOD_STEP = 2;
const DETAILS_STEP = 3;

const EditTrade = ({ id }: { id: number }) => {
	const [list, setList] = useState<List>();
	const [uiList, setUiList] = useState<UIList>();
	const [showFilters, setShowFilters] = useState(false);
	const { address } = useAccount();

	useEffect(() => {
		fetch(`/api/lists/${id}`, {
			headers: {
				Authorization: `Bearer ${getAuthToken()}`
			}
		})
			.then((res) => res.json())
			.then((data: List) => {
				const {
					fiat_currency: fiatCurrency,
					token,
					margin_type: marginType,
					total_available_amount: totalAvailableAmount,
					limit_min: limitMin,
					limit_max: limitMax,
					payment_methods: paymentMethods,
					margin,
					deposit_time_limit: depositTimeLimit,
					payment_time_limit: paymentTimeLimit,
					terms,
					chain_id: chainId,
					accept_only_verified: acceptOnlyVerified,
					escrow_type: escrowType,
					banks,
					price_source: priceSource
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
					paymentMethods,
					terms: terms || '',
					margin: margin ? Number(margin) : undefined,
					depositTimeLimit: depositTimeLimit ? Number(depositTimeLimit) : 0,
					paymentTimeLimit: paymentTimeLimit ? Number(paymentTimeLimit) : 0,
					chainId,
					acceptOnlyVerified,
					escrowType,
					banks,
					priceSource
				};
				setUiList(ui);
			});
	}, [address]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [uiList?.step]);

	if (address === undefined || list === undefined || uiList === undefined) {
		return <Loading />;
	}

	if (list.seller.address !== address) {
		return <ErrorPage statusCode={404} />;
	}

	const { step } = uiList;

	const handleToggleFilters = () => {
		setShowFilters(!showFilters);
	};

	return (
		<div className="pt-4 md:pt-6">
			<div className="w-full flex flex-col md:flex-row px-4 sm:px-6 md:px-8 mb-16">
				<div className="w-full lg:w-2/4">
					<Steps
						currentStep={step}
						stepsCount={2}
						onStepClick={(n) => setUiList({ ...uiList, ...{ step: n } })}
					/>
					<div className="flex flex-row justify-end md:hidden md:justify-end" onClick={handleToggleFilters}>
						<AdjustmentsVerticalIcon
							width={24}
							height={24}
							className="text-gray-600 hover:cursor-pointer"
						/>
						<span className="text-gray-600 hover:cursor-pointer ml-2">Details</span>
					</div>
					{showFilters && (
						<div className="mt-4 md:hidden">
							<Summary list={uiList} />
						</div>
					)}
					{step === AMOUNT_STEP && <Amount list={uiList} updateList={setUiList} />}
					{step === PAYMENT_METHOD_STEP && <PaymentMethod list={uiList} updateList={setUiList} />}
					{step === DETAILS_STEP && <Details list={uiList} updateList={setUiList} />}
				</div>
				<div className="hidden lg:contents">
					<Summary list={uiList} />
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) => ({
	props: { title: 'Edit Ad', id: String(context.params?.id) }
});

export default EditTrade;
