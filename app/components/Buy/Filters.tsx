import Input from 'components/Input/Input';
import CurrencySelect from 'components/Select/CurrencySelect';
import Select from 'components/Select/Select';
import { FiatCurrency } from 'models/types';
import React from 'react';

const optionItems = [{ option1: 'option1', option2: 'option2', option3: 'option3' }];

const Filters = () => (
	<div className="flex items-center space-x-4">
		<Input label="Search by amount" id="0" addOn="INR ₹" placeholder="Enter Amount" />
		<Select
			label="Verfication"
			selected={undefined}
			// eslint-disable-next-line react/jsx-no-bind, func-names
			onSelect={function (): void {
				throw new Error('Function not implemented.');
			}}
			options={[optionItems]}
		/>
		<Select
			label="Payment Method"
			selected={undefined}
			// eslint-disable-next-line react/jsx-no-bind, func-names
			onSelect={function (): void {
				throw new Error('Function not implemented.');
			}}
			options={[optionItems]}
		/>
		<CurrencySelect
			label="Currency"
			onSelect={function (option: FiatCurrency | undefined): void {
				throw new Error('Function not implemented.');
			}}
			selected={undefined}
		/>
	</div>
);

export default Filters;
