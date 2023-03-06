import { Input, CurrencySelect, TokenSelect, Button } from 'components';
import { FiatCurrency, Token } from 'models/types';
import { useState } from 'react';

export default function Quick() {
	const [fiatAmount, setFiatAmount] = useState<number>();
	const [tokenAmount, setTokenAmount] = useState<number>();
	const [currency, setCurrency] = useState<FiatCurrency>();
	const [token, setToken] = useState<Token>();

	return (
		<div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<form className="space-y-6" action="#" method="POST">
						<div>
							<Input
								label="Fiat Amount"
								id="fiat"
								placeholder="Enter Amount"
								style="h-16"
								addOn={<CurrencySelect onSelect={setCurrency} selected={currency} minimal />}
								type="decimal"
								onChangeNumber={setFiatAmount}
							/>
						</div>

						<div>
							<Input
								label="Crypto to Receive"
								id="crypto"
								placeholder="Enter Amount"
								style="h-16"
								addOn={<TokenSelect onSelect={setToken} selected={token} minimal />}
								type="decimal"
								decimalScale={token?.decimals}
								onChangeNumber={setTokenAmount}
							/>
						</div>

						<Button title="Buy Crypto" disabled={!(currency && token && fiatAmount && tokenAmount)} />
					</form>
				</div>
			</div>
		</div>
	);
}
