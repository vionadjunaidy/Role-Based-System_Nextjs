import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    const API = process.env.API_BASE || 'http://localhost:3001';
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
  if (!refreshToken) return NextResponse.json({ error: 'No refresh token' }, { status: 401 });

    const r = await fetch(`${API}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!r.ok) {
      const res = NextResponse.json({ error: 'Refresh failed' }, { status: 401 });
      res.cookies.set('accessToken', '', { httpOnly: true, maxAge: 0, path: '/' });
      res.cookies.set('refreshToken', '', { httpOnly: true, maxAge: 0, path: '/' });
      res.cookies.set('accessExp', '', { maxAge: 0, path: '/' });
      res.cookies.set('role', '', { maxAge: 0, path: '/' });
      return res;
    }

    const { accessToken, expiresIn, role } = await r.json();
    const expiresAt = Date.now() + (expiresIn ?? 0) * 1000;
    const res = NextResponse.json({ accessToken, expiresIn, role });
    
    res.cookies.set('accessToken', accessToken, { 
      httpOnly: true, 
      sameSite: 'lax', 
      path: '/',
      maxAge: expiresIn
    });
    res.cookies.set('accessExp', String(expiresAt), { 
      sameSite: 'lax', 
      path: '/',
      maxAge: expiresIn 
    });
    if (role) {
      res.cookies.set('role', role, { 
        sameSite: 'lax', 
        path: '/',
        maxAge: expiresIn 
      });
    }
    
    return res;
}
