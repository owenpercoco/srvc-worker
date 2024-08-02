import type { Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const authConfig = {
  pages: {
  },
  callbacks: {
    async redirect({ url, baseUrl }: { url: string, baseUrl: string }): Promise<string> {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    },
    async session({ session, user }: { session: Session, user: User }): Promise<Session> {
      session.user = user;
      return session;
    },
    async jwt({ token, user }: { token: JWT, user?: User }): Promise<JWT> {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  providers: [], // Add your providers here
};

export default function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (pathname === '/inventory' || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('next-auth.session-token');
  if (!token) {
    return NextResponse.redirect(new URL('/inventory', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/inventory/:path*'],
};
