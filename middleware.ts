import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
	const session: any = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET
	});

	if (
		!session &&
		(req.nextUrl.pathname.startsWith('/admin') ||
			req.nextUrl.pathname.startsWith('/checkout'))

		// [
		// 	'/checkout/address',
		// 	'/checkout/summary',
		// 	'/admin',
		// 	'/admin/orders',
		// 	'/admin/products'
		// ].includes(req.nextUrl.pathname)
	) {
		const requestedPage = req.nextUrl.pathname;

		const url = req.nextUrl.clone();

		url.pathname = '/auth/login';

		url.search = `p=${requestedPage}`;

		return NextResponse.redirect(url);
	}

	if (session && req.nextUrl.pathname.startsWith('/admin')) {
		const validRoles = ['admin', 'super-user', 'SEO'];

		if (!validRoles.includes(session.user?.role!)) {
			return NextResponse.redirect(new URL('/', req.url));
		}
	}

	return NextResponse.next();
}
