import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email, password, role } = await req.json();
  const API = process.env.API_BASE || 'http://localhost:3001';

  const r = await fetch(`${API}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });

  if (!r.ok) {
    const msg = await r.text();
    return NextResponse.json({ error: msg || 'Signup failed' }, { status: r.status });
  }
  let created = null;
  try {
    created = await r.json();
  } catch (_) {
    created = {};
  }
  return NextResponse.json(created, { status: r.status });
}
