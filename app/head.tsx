/* eslint-disable no-param-reassign */
import Head from 'next/head';
import Script from 'next/script';
import React from 'react';

export default function Header() {
	// @ts-expect-error
	const clarity = (c, l, a, r, i, t, y) => {
		c[a] =
			c[a] ||
			// eslint-disable-next-line func-names
			function () {
				// eslint-disable-next-line prefer-rest-params
				(c[a].q = c[a].q || []).push(arguments);
			};
		t = l.createElement(r);
		t.async = 1;
		// eslint-disable-next-line prefer-template
		t.src = 'https://www.clarity.ms/tag/' + i;
		// eslint-disable-next-line prefer-destructuring
		y = l.getElementsByTagName(r)[0];
		y.parentNode.insertBefore(t, y);
	};

	return (
		<>
			<Head>
				<title>OpenPeer - Self-Custody P2P Crypto Trading</title>
				<meta content="width=device-width, initial-scale=1" name="viewport" />
				<meta
					name="description"
					content="Trade crypto on our decentralized P2P platform. Select your token and fiat, set your margin, and start trading today."
				/>
				<link rel="icon" href="/favicon.png?v=2" />
			</Head>
			{process.env.NODE_ENV === 'production' && (
				<>
					<Script
						src="https://unpkg.com/@arcxmoney/analytics"
						onLoad={() => {
							// @ts-expect-error
							ArcxAnalyticsSdk.init(
								'7daa6d035cf0f0853f82c75a7377bb4a907989202c4cb93ee76532ddfb015445',
								{}
							).then(
								// @ts-expect-error
								(sdk) => {
									// @ts-expect-error
									window.arcx = sdk;
								}
							);
						}}
					/>
					{/* @ts-expect-error */}
					<Script id="clarity">{clarity(window, document, 'clarity', 'script', 'j17nowbio9')}</Script>
				</>
			)}
		</>
	);
}
