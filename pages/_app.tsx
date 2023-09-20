import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';

import dynamic from 'next/dynamic';
import React from 'react';

const Layout = dynamic(() => import('../components/Layout'), { ssr: false });

// @ts-expect-error
const App = ({ Component, pageProps }: AppProps) => <Layout pageProps={pageProps} Component={Component} />;

export default App;
