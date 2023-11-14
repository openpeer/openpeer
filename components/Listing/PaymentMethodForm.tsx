/* eslint-disable react/jsx-curly-newline */
import Button from 'components/Button/Button';
import Input from 'components/Input/Input';
import BankSelect from 'components/Select/BankSelect';
import Textarea from 'components/Textarea/Textarea';
import React from 'react';
import { Bank, List } from 'models/types';
import { useFormErrors } from 'hooks';
import { Errors, Resolver } from 'models/errors';
import { UIPaymentMethod } from './Listing.types';

interface PaymentMethodFormProps {
	currencyId: number;
	type: List['type'];
	paymentMethod: UIPaymentMethod;
	updatePaymentMethod: (paymentMethod: UIPaymentMethod) => void;
	onFinish: (paymentMethod: any) => void;
	bankIds: number[];
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
	currencyId,
	type,
	paymentMethod,
	updatePaymentMethod,
	onFinish,
	bankIds
}) => {
	const { bank, values = {} } = paymentMethod || ({} as UIPaymentMethod);
	const { account_info_schema: schema = [] } = (bank || {}) as Bank;
	const { errors, validate } = useFormErrors();

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

		// allow editing of existing payment method
		if (!paymentMethod.id && bank?.id && bankIds.includes(bank.id)) {
			error.bankId = 'This method is already added';
		}

		return error;
	};

	const onSave = () => {
		if (validate(resolver)) {
			onFinish(paymentMethod);
		}
	};

	return (
		<div className="mb-2">
			<BankSelect
				currencyId={currencyId}
				onSelect={(b) => updatePaymentMethod({ ...paymentMethod, ...{ bank: b, values: {} } })}
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
									...{
										values: {
											...paymentMethod.values,
											...{ [schemaId]: value }
										}
									}
								})
							}
							error={errors[schemaId]}
							value={values[schemaId]}
							required={required}
						/>
					);
				})}
			<Button title="Save" onClick={onSave} />
		</div>
	);
};

export default PaymentMethodForm;
