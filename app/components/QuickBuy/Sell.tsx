import Button from 'components/Button/Button';
import Input from 'components/Input/Input';
import Loading from 'components/Loading/Loading';
import CurrencySelect from 'components/Select/CurrencySelect';
import TokenSelect from 'components/Select/TokenSelect';
import { formatUnits } from 'ethers/lib/utils.js';
import { useEscrowFee } from 'hooks';
import { FiatCurrency, Token } from 'models/types';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface SellProps {
	onLoading: (loading: boolean) => void;
}

const Sell = ({ onLoading }: SellProps) => {
	const [tokenAmount, setTokenAmount] = useState<number>();
	const [currency, setCurrency] = useState<FiatCurrency>();
	const [token, setToken] = useState<Token>();
	const [loading, setLoading] = useState(false);

	const { fee } = useEscrowFee({ token, tokenAmount });

	const router = useRouter();

	const updateLoading = (l: boolean) => {
		setLoading(l);
		onLoading(l);
	};

	const onPostAd = async () => {
		if (currency && token && tokenAmount) {
			updateLoading(true);
			await new Promise((resolve) => setTimeout(resolve, 1500));
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
			<div className={`${loading ? 'hidden' : ''}`}>
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
			</div>
			<div className={`${!loading ? 'hidden' : ''}`}>
				<div className="">
					<Loading message="We are redirecting you to your ad 🚀" big={false} row={false} />
				</div>
			</div>
		</>
	);
};

export default Sell;
