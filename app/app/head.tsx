import Head from 'next/head';

export default function Header() {
	return (
		<Head>
			<title>OpenPeer - Self-Custody P2P Crypto Trading</title>
			<meta content="width=device-width, initial-scale=1" name="viewport" />
			<meta
				name="description"
				content="Trade crypto on our decentralized P2P platform. Select your token and fiat, set your margin, and start trading today."
			/>
			<link rel="icon" href="/favicon.png?v=2" />
		</Head>
	);
}
