'use client';
import FooterSite from '../components/footer';
import Script from 'next/script';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head />
			{process.env.NODE_ENV === 'production' && (
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
			)}
			<body>
				{/* Page */}
				<div className="container mx-auto px-4">{children}</div>
				{/* Footer */}
				<FooterSite />
			</body>
		</html>
	);
}
