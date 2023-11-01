/* eslint-disable react/jsx-curly-newline */
import { BankSelect, Button, Input, Loading, Textarea } from 'components';
import { UIPaymentMethod } from 'components/Listing/Listing.types';
import StepLayout from 'components/Listing/StepLayout';
import { useConfirmationSignMessage, useFormErrors, useAccount } from 'hooks';
import { Errors, Resolver } from 'models/errors';
import { Bank, PaymentMethod as PaymentMethodType } from 'models/types';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import snakecaseKeys from 'snakecase-keys';

import { PencilSquareIcon } from '@heroicons/react/20/solid';

import { getAuthToken } from '@dynamic-labs/sdk-react';
import { BuyStepProps } from './Buy.types';

const PaymentMethod = ({ order, updateOrder }: BuyStepProps) => {
	const { address } = useAccount();
	const { list, paymentMethod = {} as PaymentMethodType } = order;
	const { type, payment_methods: paymentMethods, fiat_currency: currency } = list;
	const { id, values = {} } = paymentMethod;
	const [bank, setBank] = useState<Bank>();
	const { account_info_schema: schema = [] } = (bank || {}) as Bank;
	const { errors, clearErrors, validate } = useFormErrors();
	const router = useRouter();

	const resolver: Resolver = () => {
		const error: Errors = {};

		if (!bank?.id) {
			error.bankId = 'Should be present';
		}

		if (type === 'BuyList') {
			schema.forEach((field) => {
				if (field.required && !values[field.id]) {
					error[field.id] = `${field.label} should be present`;
				}
			});
		}

		return error;
	};

	const { signMessage } = useConfirmationSignMessage({
		onSuccess: async (data, variables) => {
			const result = await fetch('/api/orders/', {
				method: 'POST',
				body: JSON.stringify(
					snakecaseKeys(
						{
							order: {
								listId: order.list.id,
								fiatAmount: order.fiat_amount,
								tokenAmount: order.token_amount,
								price: order.price,
								paymentMethod: type === 'BuyList' ? { bankId: bank?.id, values } : { id: bank!.id }
							},
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
			});
			const { uuid } = await result.json();
			if (uuid) {
				router.push(`/orders/${uuid}`);
			}
		}
	});

	const onProceed = () => {
		if (validate(resolver)) {
			const message = JSON.stringify(
				snakecaseKeys(
					{
						listId: order.list.id,
						fiatAmount: order.fiat_amount,
						tokenAmount: order.token_amount,
						price: order.price,
						paymentMethod: bank?.name
					},
					{ deep: true }
				),
				undefined,
				4
			);
			signMessage({ message });
		}
	};

	const [edit, setEdit] = useState(false);
	const setPaymentMethod = (pm: UIPaymentMethod | undefined) => {
		setEdit(false);
		clearErrors([...schema.map((field) => field.id), ...['bankId']]);
		updateOrder({ ...order, ...{ paymentMethod: pm, bankId: pm?.bank?.id } });
	};

	const updatePaymentMethod = (pm: UIPaymentMethod | undefined) => {
		clearErrors([...schema.map((field) => field.id), ...['bankId']]);
		updateOrder({ ...order, ...{ paymentMethod: pm, bankId: pm?.bank?.id } });
	};

	const enableEdit = (e: React.MouseEvent<HTMLElement>, pm: UIPaymentMethod) => {
		e.stopPropagation();
		updatePaymentMethod(pm);
		setEdit(true);
	};

	// useEffect(() => {
	// 	setLoading(true);

	// 	fetch(`/api/payment-methods?currency_id=${currency!.id}`, {
	// 		headers: {
	// 			Authorization: `Bearer ${getAuthToken()}`
	// 		}
	// 	})
	// 		.then((res) => res.json())
	// 		.then((data: PaymentMethodType[]) => {

	// 			const filtered = data.filter((pm) => pm.bank.id === list.bank.id);
	// 			setPaymentMethods(filtered);
	// 			if (!paymentMethod.values) {
	// 				setPaymentMethod(filtered[0]);
	// 			} else {
	// 				setPaymentMethod(undefined);
	// 			}
	// 			setLoading(false);
	// 		});
	// }, [address, currency, type]);

	const banks = type === 'SellList' ? paymentMethods.map((pm) => ({ ...pm.bank, ...{ id: pm.id } })) : list.banks;

	return (
		<StepLayout onProceed={onProceed} buttonText="Sign and Continue">
			<h2 className="text-xl mt-8 mb-2">Payment Methods</h2>
			<p>{type === 'BuyList' ? 'Choose how you want to receive your money' : 'Choose how you want to pay'}</p>
			<BankSelect
				currencyId={currency.id}
				onSelect={(b) => setBank(b as Bank)}
				selected={bank}
				options={banks}
				error={errors.bankId}
			/>

			{(!id || edit) && type === 'BuyList' ? (
				<>
					{schema.map(({ id: schemaId, label, placeholder, type: schemaType = 'text', required }) => {
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
												values: { ...paymentMethod.values, ...{ [schemaId]: e.target.value } }
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
				!list.id && (
					<div>
						<Button
							title="Add New Payment Method +"
							outlined
							onClick={() => updatePaymentMethod(undefined)}
						/>
					</div>
				)
			)}
		</StepLayout>
	);
};

export default PaymentMethod;
