// pages/_app.tsx;

import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import type { Router } from 'next/router';

import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { updateIntercom } from 'utils/intercom';

const Layout = dynamic(() => import('../components/Layout'), { ssr: false });

const App = ({ Component, pageProps }: AppProps & { router: Router }) => {
	const router = useRouter();

	useEffect(() => {
		const handleRouteChange = () => {
			updateIntercom();
		};

		router.events.on('routeChangeComplete', handleRouteChange);
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router.events]);

	return <Layout pageProps={pageProps} Component={Component} router={router as Router} />;
};

export default App;
