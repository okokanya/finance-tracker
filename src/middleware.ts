import { NextRequest, NextResponse } from 'next/server';

import { PROFILE_COOKIE_VALUE, PROFILE_KEY, TOKEN_KEY } from '@/features/profile/profile.constants';

const SIGN_IN_PATH_NAME = '/signin';
const UNAUTHORIZED_PAGES = [SIGN_IN_PATH_NAME, '/signup'];

export async function middleware(req: NextRequest) {
  const cookies = req.cookies;
  const token = cookies.get(TOKEN_KEY);
  const profile = cookies.get(PROFILE_KEY);
  const isUnauthorizedPage = UNAUTHORIZED_PAGES.includes(req.nextUrl.pathname);

  // Если токен или флаг профиля отсутствует или истек, обрабатываем переход
  // на экраны в неавторизованной зоне или выполняем редирект на экран входа
  if (!token || !profile || profile.value !== PROFILE_COOKIE_VALUE) {
    req.cookies.clear();

    const res = isUnauthorizedPage
      ? NextResponse.next()
      : NextResponse.redirect(new URL(SIGN_IN_PATH_NAME, req.url));

    res.cookies.delete(PROFILE_KEY);
    res.cookies.delete(TOKEN_KEY);

    return res;
  }

  // Если токен существует, но происходит переход
  // на страницу в неавторизованной зоне, то редирект на экран счетов
  if (isUnauthorizedPage) {
    return NextResponse.redirect(new URL('/accounts', req.url));
  }

  // Если токен валиден, продолжаем выполнение запроса
  return NextResponse.next();
}

// Конфигурация middleware (укажите пути, для которых middleware не будет выполняться)
export const config = {
  matcher: [
    /*
     * Исключите следующие пути:
     * - API routes
     * - Статические файлы (если нужно)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
