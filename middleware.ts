// middleware.ts
// import { NextResponse, type NextRequest } from 'next/server';
// import * as jose from 'jose';

// export async function middleware(req: NextRequest) {
// 	const previousPage = req.nextUrl.pathname;

// 	if (previousPage.startsWith('/checkout')) {
// 		const token = req.cookies.get('token') || '';

// 		try {
// 			await jose.jwtVerify(
// 				token,
// 				new TextEncoder().encode(process.env.JWT_SECRET_SEED)
// 			);
// 			return NextResponse.next();
// 		} catch (error) {
// 			return NextResponse.redirect(
// 				new URL(`/auth/login?p=${previousPage}`, req.url)
// 			);
// 		}
// 	}
// }

// export const config = {
// 	matcher: ['/checkout/:path*']
// };

// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
	const session: any = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET
	});

	// Información útil sobre el usuario

	if (
		!session &&
		['/checkout/address', '/checkout/summary', '/admin'].includes(
			req.nextUrl.pathname
		)
	) {
		const requestedPage = req.nextUrl.pathname;
		const url = req.nextUrl.clone();
		url.pathname = '/auth/login';
		url.search = `p=${requestedPage}`;

		return NextResponse.redirect(url);
	}

	if (req.nextUrl.pathname.startsWith('/admin')) {
		const validRoles = ['admin', 'super-user', 'SEO'];

		if (!validRoles.includes(session?.user.role)) {
			return NextResponse.redirect(new URL('/', req.url));
		}
	}

	// return NextResponse.redirect(new URL('/about-2', request.url));
	return NextResponse.next();
}

// See "Matching Paths" below to learn more
// export const config = {
// 	matcher: ['/checkout/address', '/checkout/summary']
// };
