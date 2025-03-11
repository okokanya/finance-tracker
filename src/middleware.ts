import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  // Получаем куки из запроса
  const cookies = req.cookies;
  const token = cookies.get('token');

  // Если токен отсутствует или истек, выполняем редирект на /signin
  if (!token) {
    return NextResponse.redirect(new URL('/signin', req.url));
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
     * - Страница входа (/signin)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|signin|signup).*)',
  ],
};
