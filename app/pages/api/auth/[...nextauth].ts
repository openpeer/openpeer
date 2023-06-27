/* eslint-disable no-param-reassign */
import jwt from 'jsonwebtoken';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getCsrfToken } from 'next-auth/react';
import { SiweMessage } from 'siwe';

import { minkeApi } from '../utils/utils';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: any, res: any) {
	const providers = [
		CredentialsProvider({
			name: 'Ethereum',
			credentials: {
				message: {
					label: 'Message',
					type: 'text',
					placeholder: '0x0'
				},
				signature: {
					label: 'Signature',
					type: 'text',
					placeholder: '0x0'
				}
			},
			async authorize(credentials) {
				try {
					const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'));
					const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!);
					const result = await siwe.verify({
						signature: credentials?.signature || '',
						domain: nextAuthUrl.host,
						nonce: await getCsrfToken({ req })
					});
					if (result.success) {
						return {
							id: siwe.address,
							name: credentials?.signature,
							email: siwe.prepareMessage() || ''
						};
					}
					return null;
				} catch (e) {
					return null;
				}
			}
		})
	];

	const isDefaultSigninPage = req.method === 'GET' && req.query.nextauth.includes('signin');

	// Hide Sign-In with Ethereum from default sign page
	if (isDefaultSigninPage) {
		providers.pop();
	}
	const result = await NextAuth(req, res, {
		// https://next-auth.js.org/configuration/providers/oauth
		providers,
		session: {
			strategy: 'jwt'
		},
		secret: process.env.NEXTAUTH_SECRET,
		callbacks: {
			async session({ session, token }: { session: any; token: any }) {
				const encodedToken = jwt.sign(token, process.env.NEXTAUTH_SECRET!, { algorithm: 'HS256' });
				session.address = token.sub;
				session.token = token;
				session.jwt = encodedToken;
				const { data: user } = await minkeApi.get(`/users/${session.address}`);
				session.user = user.data;
				return session;
			}
		}
	});

	return result;
}
