import { BankSelect, Button, Input, Loading, Textarea } from 'components';
import { useFormErrors } from 'hooks';
import { Errors, Resolver } from 'models/errors';
import { Bank, PaymentMethod } from 'models/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { PencilSquareIcon } from '@heroicons/react/20/solid';

import { ListStepProps, UIPaymentMethod } from './Listing.types';
import StepLayout from './StepLayout';

const PaymentMethod = ({ list, updateList }: ListStepProps) => {
	const { address } = useAccount();
	const { currency, paymentMethod = {} as PaymentMethod, type } = list;
	const { id, bank, values = {} } = paymentMethod;
	const { account_info_schema: schema = [] } = (bank || {}) as Bank;
	const { errors, clearErrors, validate } = useFormErrors();

	const resolver: Resolver = () => {
		const error: Errors = {};

		if (!bank?.id) {
			error.bankId = 'Should be present';
		}

		if (type === 'SellList') {
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

	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>();
	const [isLoading, setLoading] = useState(false);
	const [edit, setEdit] = useState(false);
	const setPaymentMethod = (pm: UIPaymentMethod | undefined) => {
		setEdit(false);
		clearErrors([...schema.map(({ id }) => id), ...['bankId']]);
		updateList({ ...list, ...{ paymentMethod: pm, bankId: pm?.bank?.id } });
	};

	const updatePaymentMethod = (pm: UIPaymentMethod | undefined) => {
		clearErrors([...schema.map(({ id }) => id), ...['bankId']]);
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
			setPaymentMethod(undefined);
			setPaymentMethods([]);
			setLoading(false);
			return;
		}

		fetch(`/api/payment-methods?address=${address}&currency_id=${currency!.id}`)
			.then((res) => res.json())
			.then((data) => {
				setPaymentMethods(data);
				if (!paymentMethod.bank?.id) {
					setPaymentMethod(data[0]);
				} else {
					setPaymentMethod(undefined);
				}
				setLoading(false);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
								bank: { account_info_schema: schema }
							} = pm;
							const field = schema.find(({ id }) => id === key);
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
						schema.map(({ id, label, placeholder, type = 'text', required }) => {
							if (type === 'message') {
								return (
									<div className="mb-4" key={id}>
										<span className="text-sm">{label}</span>
									</div>
								);
							}

							if (type === 'textarea') {
								return (
									<Textarea
										rows={4}
										key={id}
										label={label}
										id={id}
										placeholder={placeholder}
										onChange={(e) =>
											updatePaymentMethod({
												...paymentMethod,
												...{ values: { ...paymentMethod.values, ...{ [id]: e.target.value } } }
											})
										}
										value={values[id]}
										error={errors[id]}
									/>
								);
							}
							return (
								<Input
									key={id}
									label={label}
									type="text"
									id={id}
									placeholder={placeholder}
									onChange={(value) =>
										updatePaymentMethod({
											...paymentMethod,
											...{ values: { ...paymentMethod.values, ...{ [id]: value } } }
										})
									}
									error={errors[id]}
									value={values[id]}
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
