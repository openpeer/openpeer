/* eslint-disable react/jsx-curly-newline */
import { BankSelect, Button, Input, Loading, Textarea } from 'components';
import { useFormErrors } from 'hooks';
import { Errors, Resolver } from 'models/errors';
import { Bank, PaymentMethod as PaymentMethodType } from 'models/types';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { PencilSquareIcon } from '@heroicons/react/20/solid';

import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { ListStepProps, UIPaymentMethod } from './Listing.types';
import StepLayout from './StepLayout';

const PaymentMethod = ({ list, updateList }: ListStepProps) => {
	const { address } = useAccount();
	const { currency, paymentMethod = {} as PaymentMethodType, type } = list;
	const { id, bank, values = {} } = paymentMethod;
	const { account_info_schema: schema = [] } = (bank || {}) as Bank;
	const { errors, clearErrors, validate } = useFormErrors();

	const resolver: Resolver = () => {
		const error: Errors = {};

		if (!bank?.id) {
			error.bankId = 'Should be present';
		}

		if (type === 'SellList') {
			// eslint-disable-next-line no-restricted-syntax
			for (const field of schema) {
				if (field.required && !values[field.id]) {
					error[field.id] = `${field.label} should be present`;
				}
			}
		}

		return error;
	};

	const onProceed = () => {
		if (validate(resolver)) {
			updateList({ ...list, ...{ step: list.step + 1 } });
		}
	};

	const [paymentMethods, setPaymentMethods] = useState<PaymentMethodType[]>();
	const [isLoading, setLoading] = useState(false);
	const [edit, setEdit] = useState(false);
	const setPaymentMethod = (pm: UIPaymentMethod | undefined) => {
		setEdit(false);
		clearErrors([...schema.map((field) => field.id), ...['bankId']]);
		updateList({ ...list, ...{ paymentMethod: pm, bankId: pm?.bank?.id } });
	};

	const updatePaymentMethod = (pm: UIPaymentMethod | undefined) => {
		clearErrors([...schema.map((field) => field.id), ...['bankId']]);
		updateList({ ...list, ...{ paymentMethod: pm, bankId: pm?.bank?.id } });
	};

	const enableEdit = (e: React.MouseEvent<HTMLElement>, pm: UIPaymentMethod) => {
		e.stopPropagation();
		updatePaymentMethod(pm);
		setEdit(true);
	};

	useEffect(() => {
		setLoading(true);
		if (type === 'BuyList') {
			if (!list.id) {
				setPaymentMethod(undefined);
			}
			setPaymentMethods([]);
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
				setPaymentMethods(data);
				if (!paymentMethod.bank?.id) {
					setPaymentMethod(data[0]);
				} else if (!list.id) {
					setPaymentMethod(undefined);
				}
				setLoading(false);
			});
	}, [address, currency, type]);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<StepLayout onProceed={onProceed}>
			<h2 className="text-xl mt-8 mb-2">Payment Method</h2>
			<p>{type === 'BuyList' ? 'Choose how you want to pay' : 'Choose how you want to receive your money'}</p>
			{(paymentMethods || []).map((pm) => (
				<div
					key={pm.id}
					className={`${
						pm.id === paymentMethod?.id ? 'border-2 border-cyan-600' : 'border-2 border-slate-200'
					} w-full flex flex-col bg-gray-100 mt-8 py-4 p-8 rounded-md cursor-pointer`}
					onClick={() => setPaymentMethod(pm)}
				>
					<div className="w-full flex flex-row justify-between mb-4">
						<div className="flex flex-row items-center">
							<Image
								src={pm.bank.icon}
								alt={pm.bank.name}
								className="h-6 w-6 flex-shrink-0 rounded-full mr-1"
								width={24}
								height={24}
								unoptimized
							/>
							<span>{pm.bank.name}</span>
						</div>
						<div onClick={(e) => enableEdit(e, pm)}>
							<PencilSquareIcon className="h-5 w-" aria-hidden="true" />
						</div>
					</div>
					<div className="mb-4">
						{Object.keys(pm.values || {}).map((key) => {
							const {
								bank: { account_info_schema: schemaInfo }
							} = pm;
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
			))}

			{!id || edit ? (
				<>
					<BankSelect
						currencyId={currency!.id}
						onSelect={(b) =>
							updatePaymentMethod({
								...paymentMethod,
								...{ bank: b, bankId: b?.id }
							})
						}
						selected={bank}
						error={errors.bankId}
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
												...paymentMethod,
												...{
													values: {
														...paymentMethod.values,
														...{ [schemaId]: e.target.value }
													}
												}
											})
										}
										value={values[schemaId]}
										error={errors[schemaId]}
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
											...paymentMethod,
											...{ values: { ...paymentMethod.values, ...{ [schemaId]: value } } }
										})
									}
									error={errors[schemaId]}
									value={values[schemaId]}
									required={required}
								/>
							);
						})}
				</>
			) : (
				<div>
					<Button title="Add New Payment Method +" outlined onClick={() => updatePaymentMethod(undefined)} />
				</div>
			)}
		</StepLayout>
	);
};

export default PaymentMethod;
