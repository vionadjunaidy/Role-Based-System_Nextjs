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

  const { accessToken, refreshToken, expiresIn } = await loginRes.json();

  const profileRes = await fetch(`${API}/profile`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!profileRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }

  const profile = await profileRes.json();
  const role = profile.role || 'user';
  const expiresAt = Date.now() + (expiresIn ?? 0) * 1000;

  const res = NextResponse.json({ accessToken, expiresIn, role }); 
  res.cookies.set('accessToken', accessToken, { 
    httpOnly: true, sameSite: 'lax', path: '/', maxAge: expiresIn 
  });
  res.cookies.set('refreshToken', refreshToken, { 
    httpOnly: true, sameSite: 'lax', path: '/' 
  });
  res.cookies.set('accessExp', String(expiresAt), { 
    sameSite: 'lax', path: '/', maxAge: expiresIn 
  });
  res.cookies.set('role', role, { sameSite: 'lax', path: '/' });
  return res;
}
