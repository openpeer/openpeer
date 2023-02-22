/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'raw.githubusercontent.com'
			},
			{
				protocol: 'https',
				hostname: 'openpeerimages.s3.us-west-1.amazonaws.com'
			}
		]
	}
};

module.exports = nextConfig;
