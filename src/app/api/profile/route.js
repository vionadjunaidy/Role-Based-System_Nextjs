import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 });
    }

    const API = process.env.API_BASE || 'http://localhost:3001';
    
    const profileRes = await fetch(`${API}/profile`, {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store',
    });

    if (!profileRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: profileRes.status });
    }

    const profile = await profileRes.json();
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}