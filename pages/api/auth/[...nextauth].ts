import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { dbUsers } from '../../../database';

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		// ...add more providers here
		Credentials({
			name: 'Custom Login',
			credentials: {
				email: {
					label: 'Correo:',
					type: 'email',
					placeholder: 'correo@google.com'
				},
				password: {
					label: 'Contraseña:',
					type: 'password',
					placeholder: 'Contraseña'
				}
			},
			async authorize(credentials) {
				console.log({ credentials });
				// TODO: validar contra base de datos

				// return { name: 'Juan', correo: 'juan@google.com', role: 'admin' };

				return await dbUsers.checkUserEmailPassword(
					credentials!.email,
					credentials!.password
				);
			}
		}),

		GithubProvider({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!
		})
	],

	// Callbacks
	jwt: {
		// secret: process.env.JWT_SECRET_SEED, // deprecated
	},

	callbacks: {
		async jwt({ token, account, user }) {
			// console.log({ token, account, user });

			if (account) {
				token.accessToken = account.access_token;

				switch (account.type) {
					case 'oauth':
						// TODO: crear usuario o verificar si existe en mi DB
						break;

					case 'credentials':
						token.user = user;
						break;
				}
			}

			return token;
		},

		async session({ session, token, user }) {
			// console.log({ session, token, user });

			session.accessToken = token.accessToken;
			session.user = token.user as any;

			return session;
		}
	}
});
