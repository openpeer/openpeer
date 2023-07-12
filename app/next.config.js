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
				hostname: 'cryptologos.cc'
			},
			{
				protocol: 'https',
				hostname: 'openpeerimages.s3.us-west-1.amazonaws.com'
			},
			{
				protocol: 'https',
				hostname: 'openpeerbanksimages.s3.us-west-1.amazonaws.com'
			}
		]
	},
	webpack: (config) => {
		config.resolve.fallback = { fs: false, net: false, tls: false };
		return config;
	}
};

module.exports = nextConfig;
