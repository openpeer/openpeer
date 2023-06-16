import Input from 'components/Input/Input';
import CurrencySelect from 'components/Select/CurrencySelect';
import DropDown from 'components/Select/DropDown';
import { FiatCurrency } from 'models/types';
import React from 'react';

const Filters = () => (
	<div className="flex items-center space-x-4">
		<Input label="Search by amount" addOn="INR ₹" id="0" placeholder="Enter Amount" />
		<DropDown label="Verfication" />
		<DropDown label="Payment Method" />
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
