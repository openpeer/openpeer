import { Button, Loading } from 'components';
import { useAccount } from 'hooks';
import { Bank, PaymentMethod as PaymentMethodType } from 'models/types';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { PencilSquareIcon } from '@heroicons/react/20/solid';

import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { ListStepProps, UIPaymentMethod } from './Listing.types';
import StepLayout from './StepLayout';
import PaymentMethodForm from './PaymentMethodForm';

const PaymentMethod = ({ list, updateList }: ListStepProps) => {
	const { address } = useAccount();

	const { currency, paymentMethods = [], type, banks = [] } = list;
	const [paymentMethodCreation, setPaymentMethodCreation] = useState<UIPaymentMethod>();

	const onProceed = () => {
		if (paymentMethods.length > 0) {
			const filteredPaymentMethods = paymentMethods.map((pm) => {
				if (pm.id && newPaymentMethods.find((npm) => npm.id === pm.id)) {
					return { ...pm, ...{ id: undefined, bank_id: pm.bank!.id } };
				}
				return { ...pm, ...{ bank_id: pm.bank!.id } };
			});
			if (type === 'SellList') {
				updateList({ ...list, ...{ step: list.step + 1, paymentMethods: filteredPaymentMethods } });
			} else {
				updateList({
					...list,
					...{ step: list.step + 1, banks: filteredPaymentMethods.map((pm) => pm.bank as Bank) }
				});
			}
		}
	};

	const [apiPaymentMethods, setApiPaymentMethods] = useState<PaymentMethodType[]>();
	const [newPaymentMethods, setNewPaymentMethods] = useState<UIPaymentMethod[]>([]);
	const [isLoading, setLoading] = useState(false);
	const updatePaymentMethods = (pms: UIPaymentMethod[]) => {
		setPaymentMethodCreation(undefined);
		updateList({ ...list, ...{ paymentMethods: pms } });
	};

	const togglePaymentMethod = (pm: UIPaymentMethod) => {
		const index = paymentMethods.findIndex((m) => m === pm);
		if (index >= 0) {
			updatePaymentMethods([...paymentMethods.slice(0, index), ...paymentMethods.slice(index + 1)]);
		} else {
			updatePaymentMethods([...paymentMethods, pm]);
		}
	};

	const enableEdit = (e: React.MouseEvent<HTMLElement>, pm: UIPaymentMethod) => {
		e.stopPropagation();
		setPaymentMethodCreation(pm);
	};

	const savePaymentMethodCreation = () => {
		if (paymentMethodCreation) {
			// edition - can be editing an existing payment method or a new one
			if (paymentMethodCreation.id) {
				// if existing, update it in the payment methods list
				const index = paymentMethods.findIndex((pm) => pm.id === paymentMethodCreation.id);
				if (index >= 0) {
					updatePaymentMethods([
						...paymentMethods.slice(0, index),
						paymentMethodCreation,
						...paymentMethods.slice(index + 1)
					]);
				}

				// if new, update it in the new payment methods list
				const newPaymentMethodIndex = newPaymentMethods.findIndex((pm) => pm.id === paymentMethodCreation.id);
				if (newPaymentMethodIndex >= 0) {
					setNewPaymentMethods([
						...newPaymentMethods.slice(0, newPaymentMethodIndex),
						paymentMethodCreation,
						...newPaymentMethods.slice(newPaymentMethodIndex + 1)
					]);
				}
			} else {
				// creation - add it to the new payment methods list and to the selected payment methods list
				const newPaymentMethod = { ...paymentMethodCreation, ...{ id: new Date().getTime() } };
				setNewPaymentMethods([...(newPaymentMethods || []), newPaymentMethod]);
				updatePaymentMethods([...paymentMethods, newPaymentMethod]);
			}
		}
	};

	useEffect(() => {
		setLoading(true);
		if (type === 'BuyList') {
			if (!list.id) {
				if (paymentMethods.length > 0) {
					setNewPaymentMethods(paymentMethods);
				} else {
					addNewPaymentMethod();
				}
			} else {
				const savedPaymentMethods = banks.map((bank) => ({
					bank,
					id: new Date().getTime() + bank.id,
					values: {}
				}));
				updatePaymentMethods(savedPaymentMethods);
				setNewPaymentMethods(savedPaymentMethods);
			}

			setApiPaymentMethods([]);
			setLoading(false);
			return;
		}

		fetch(`/api/payment-methods?currency_id=${currency!.id}`, {
			headers: {
				Authorization: `Bearer ${getAuthToken()}`
			}
		})
			.then((res) => res.json())
			.then((data) => {
				setApiPaymentMethods(data);
				if (paymentMethods.length === 0) {
					updatePaymentMethods(data);
				}

				// add as a new payment method if the paymentMethod is not inside data
				setNewPaymentMethods(paymentMethods.filter((pm) => !data.find((d: UIPaymentMethod) => d.id === pm.id)));
				setLoading(false);
			});
	}, [address, currency, type]);

	const addNewPaymentMethod = () => {
		setPaymentMethodCreation({} as UIPaymentMethod);
	};

	if (isLoading) {
		return <Loading />;
	}

	const existing = (apiPaymentMethods || []).map((apiPaymentMethod) => {
		const updated = paymentMethods.find((m) => m.id === apiPaymentMethod.id);
		if (updated) {
			return updated;
		}

		return apiPaymentMethod;
	});
	const listPaymentMethods = [...existing, ...newPaymentMethods];

	return (
		<StepLayout
			onProceed={paymentMethodCreation === undefined && paymentMethods.length > 0 ? onProceed : undefined}
		>
			<h2 className="text-xl mt-8 mb-2">Payment Methods</h2>
			<p>{type === 'SellList' ? 'Choose how you want to pay' : 'Choose how you want to receive your money'}</p>
			{listPaymentMethods.map(
				(pm) =>
					pm.bank && (
						<div
							key={pm.id}
							className={`${
								paymentMethods.findIndex((m) => m === pm) >= 0
									? 'border-2 border-cyan-600'
									: 'border-2 border-slate-200'
							} w-full flex flex-col bg-gray-100 mt-8 py-4 p-8 rounded-md cursor-pointer`}
							onClick={() => togglePaymentMethod(pm)}
						>
							<div
								className={`w-full flex flex-row justify-between ${type === 'SellList' ? 'mb-4' : ''}`}
							>
								<div className="flex flex-row items-center">
									{!!pm.bank.icon && (
										<Image
											src={pm.bank.icon}
											alt={pm.bank.name}
											className="h-6 w-6 flex-shrink-0 rounded-full mr-1"
											width={24}
											height={24}
											unoptimized
										/>
									)}
									<span>{pm.bank.name}</span>
								</div>
								<div onClick={(e) => enableEdit(e, pm)}>
									<PencilSquareIcon className="h-5 w-" aria-hidden="true" />
								</div>
							</div>
							{Object.keys(pm.values || {}).length > 0 && (
								<div className="mb-4">
									{Object.keys(pm.values || {}).map((key) => {
										const { account_info_schema: schemaInfo } = pm.bank as Bank;
										const field = schemaInfo.find((f) => f.id === key);
										const value = (pm.values || {})[key];
										if (!value) return <></>;

										return (
											<div className="mb-2" key={key}>
												<span>
													{field?.label}: {value}
												</span>
											</div>
										);
									})}
								</div>
							)}
						</div>
					)
			)}
			{paymentMethodCreation !== undefined ? (
				<PaymentMethodForm
					currencyId={currency!.id}
					paymentMethod={paymentMethodCreation}
					updatePaymentMethod={setPaymentMethodCreation}
					onFinish={savePaymentMethodCreation}
					type={type}
					bankIds={[
						...paymentMethods.map((pm) => pm.bank!.id),
						...newPaymentMethods.map((pm) => pm.bank!.id)
					]}
				/>
			) : (
				<div>
					<Button title="Add New Payment Method +" outlined onClick={addNewPaymentMethod} />
				</div>
			)}
		</StepLayout>
	);
};

export default PaymentMethod;
