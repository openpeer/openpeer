import Button from 'components/Button/Button';
import Input from 'components/Input/Input';
import CurrencySelect from 'components/Select/CurrencySelect';
import TokenSelect from 'components/Select/TokenSelect';
import { formatUnits } from 'ethers/lib/utils.js';
import { useEscrowFee } from 'hooks';
import debounce from 'lodash.debounce';
import { FiatCurrency, Token } from 'models/types';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Sell = () => {
	const [tokenAmount, setTokenAmount] = useState<number>();
	const [currency, setCurrency] = useState<FiatCurrency>();
	const [token, setToken] = useState<Token>();

	const { fee } = useEscrowFee({ token, tokenAmount });

	const router = useRouter();

	const onPostAd = () => {
		if (currency && token && tokenAmount) {
			router.push(
				{
					pathname: '/sell',
					query: { currency: currency.id, token: token.id, tokenAmount }
				},
				'/sell'
			);
		}
	};

	return (
		<>
			<div>
				<Input
					label="Crypto to Sell"
					id="cryptoSell"
					placeholder="Enter Amount"
					style="h-16"
					addOn={<TokenSelect onSelect={setToken} selected={token} minimal />}
					type="decimal"
					decimalScale={token?.decimals}
					onChangeNumber={setTokenAmount}
					value={tokenAmount}
				/>
			</div>
			<hr />
			<CurrencySelect
				onSelect={setCurrency}
				selected={currency}
				label="Fiat to Receive"
				height="h-16"
				selectTheFirst
			/>

			<Button title="Post Ad" disabled={!(currency && token && tokenAmount)} onClick={onPostAd} />
			<div className="text-center mt-4">
				{!!fee && !!token && (
					<span className="text-xs text-gray-600 text-center">
						Fee: {formatUnits(fee, token.decimals)} {token.symbol}
					</span>
				)}
			</div>
		</>
	);
};

export default Sell;
