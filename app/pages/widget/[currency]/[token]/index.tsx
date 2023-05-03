import { ListsTable, Loading } from 'components';
import { List } from 'models/types';
import React, { useEffect, useState } from 'react';
import { useChainId } from 'wagmi';

interface WidgetProps {
	currency: string;
	token: string;
	fiatAmount: number;
	tokenAmount: number;
}

const Widget = ({ currency, token, fiatAmount, tokenAmount }: WidgetProps) => {
	const [lists, setLists] = useState<List[]>([]);
	const [loading, setLoading] = useState(false);
	const chainId = useChainId();

	useEffect(() => {
		const search = async () => {
			if (!currency || !token || !(fiatAmount || tokenAmount)) return;
			setLoading(true);
			try {
				const params = {
					type: 'SellList',
					chain_id: String(chainId),
					fiat_currency_code: currency,
					token_address: token,
					token_amount: String(fiatAmount || ''),
					fiat_amount: String(tokenAmount || '')
				};

				const filteredParams = Object.fromEntries(
					Object.entries(params).filter(([, value]) => value !== undefined)
				);
				const response = await fetch(`/api/quickbuy?${new URLSearchParams(filteredParams).toString()}`);
				const searchLists: List[] = await response.json();
				setLists(searchLists);
			} catch {
				setLoading(false);
			}
			setLoading(false);
		};

		search();
	}, [currency, token]);

	if (loading) return <Loading />;

	return (
		<div className="p-2">
			{lists.length > 0 && (
				<ListsTable lists={lists} fiatAmount={fiatAmount} tokenAmount={tokenAmount} skipAmount />
			)}
		</div>
	);
};

Widget.getInitialProps = async (ctx: any) => {
	const { currency, token, fiatAmount, tokenAmount } = ctx.query;
	return { widget: true, currency, token, fiatAmount, tokenAmount };
};

export default Widget;
