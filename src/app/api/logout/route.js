import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('accessToken', '', { httpOnly: true, maxAge: 0, path: '/' });
  res.cookies.set('refreshToken', '', { httpOnly: true, maxAge: 0, path: '/' });
  res.cookies.set('accessExp', '', { maxAge: 0, path: '/' });
  res.cookies.set('role', '', { maxAge: 0, path: '/' });
  return res;
}
