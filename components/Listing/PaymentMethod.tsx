import { BankSelect, Button, Input, Loading, Textarea } from 'components';
import { useAccount } from 'hooks';
import { Bank, PaymentMethod as PaymentMethodType } from 'models/types';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { PencilSquareIcon } from '@heroicons/react/20/solid';

import { getAuthToken } from '@dynamic-labs/sdk-react';
import { ListStepProps, UIPaymentMethod } from './Listing.types';
import StepLayout from './StepLayout';

const PaymentMethod = ({ list, updateList }: ListStepProps) => {
	const { address } = useAccount();
	const { currency, paymentMethods = [], type } = list;
	const [paymentMethodCreation, setPaymentMethodCreation] = useState<UIPaymentMethod>();

	const onProceed = () => {
		// if (validate(resolver)) {
		updateList({ ...list, ...{ step: list.step + 1 } });
		// }
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
			// @TODO: validate

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
				updatePaymentMethods([]);
			}
			setApiPaymentMethods([]);
			setLoading(false);
			return;
		}

		fetch(`/api/payment-methods?address=${address}&currency_id=${currency!.id}`, {
			headers: {
				Authorization: `Bearer ${getAuthToken()}`
			}
		})
			.then((res) => res.json())
			.then((data) => {
				setApiPaymentMethods(data);
				if (paymentMethods.length === 0) {
					updatePaymentMethods(data);
				} else if (!list.id) {
					updatePaymentMethods([]);
				}
				setLoading(false);
			});
	}, [address, currency, type]);

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
		<StepLayout onProceed={onProceed}>
			<h2 className="text-xl mt-8 mb-2">Payment Method</h2>
			<p>{type === 'BuyList' ? 'Choose how you want to pay' : 'Choose how you want to receive your money'}</p>
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
							<div className="w-full flex flex-row justify-between mb-4">
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
						</div>
					)
			)}
			{paymentMethodCreation !== undefined ? (
				<div className="mb-2">
					<BankSelect
						currencyId={currency!.id}
						onSelect={(b) => updatePaymentMethod({ ...paymentMethodCreation, ...{ bank: b } })}
						selected={bank}
						// error={errors.bankId}
					/>
					{type === 'SellList' &&
						schema.map(({ id: schemaId, label, placeholder, type: schemaType = 'text', required }) => {
							if (schemaType === 'message') {
								return (
									<div className="mb-4" key={schemaId}>
										<span className="text-sm">{label}</span>
									</div>
								);
							}

							if (schemaType === 'textarea') {
								return (
									<Textarea
										rows={4}
										key={schemaId}
										label={label}
										id={schemaId}
										placeholder={placeholder}
										onChange={(e) =>
											updatePaymentMethod({
												...paymentMethodCreation,
												...{
													values: {
														...paymentMethodCreation.values,
														...{ [schemaId]: e.target.value }
													}
												}
											})
										}
										value={values[schemaId]}
										// error={errors[schemaId]}
									/>
								);
							}
							return (
								<Input
									key={schemaId}
									label={label}
									type="text"
									id={schemaId}
									placeholder={placeholder}
									onChange={(value) =>
										updatePaymentMethod({
											...paymentMethodCreation,
											...{ values: { ...paymentMethodCreation.values, ...{ [schemaId]: value } } }
										})
									}
									// error={errors[schemaId]}
									value={values[schemaId]}
									required={required}
								/>
							);
						})}
					<Button title="Save" onClick={savePaymentMethodCreation} />
				</div>
			) : (
				<div>
					<Button
						title="Add New Payment Method +"
						outlined
						onClick={() => setPaymentMethodCreation({} as UIPaymentMethod)}
					/>
				</div>
			)}
		</StepLayout>
	);
};

export default PaymentMethod;
