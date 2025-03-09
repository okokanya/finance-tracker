import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET!;

export async function getUser(req: NextApiRequest) {
  const token = req.cookies.token;

  if (!token) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 403 });
  }

  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 403 });
  }

  return (payload as { id: string }).id;
}
