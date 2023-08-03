import FooterSite from '../components/footer';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head />
			<body>
				{/* Page */}
				<div className="container mx-auto px-4">{children}</div>
				{/* Footer */}
				<FooterSite />
			</body>
		</html>
	);
}
