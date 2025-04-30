import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const protectedRoutes = ['/dashboard', '/profile'];
  const authRoutes = ['/login', '/register'];
  const { pathname } = request.nextUrl;

  // Verificar se a rota requer autenticação
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(pathname);

  // Verificar token no cookie
  const cookie = request.cookies.get('jwt');
  const token = cookie?.value;

  // Se estiver em rota protegida sem token, redirecionar para login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se estiver em rota de autenticação com token, redirecionar para dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};