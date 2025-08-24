import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email, password } = await req.json();
  const API = process.env.API_BASE || 'http://localhost:3001';

  const loginRes = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!loginRes.ok) {
    const msg = await loginRes.text();
    return NextResponse.json({ error: msg || 'Invalid credentials' }, { status: 401 });
  }

  const { accessToken } = await loginRes.json();

  const profileRes = await fetch(`${API}/profile`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!profileRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }

  const profile = await profileRes.json();

  const res = NextResponse.json({ role: profile.role || 'user' });
  res.cookies.set('accessToken', accessToken, { httpOnly: true, sameSite: 'lax', path: '/' });
  res.cookies.set('role', profile.role || 'user', { sameSite: 'lax', path: '/' });
  return res;
}
