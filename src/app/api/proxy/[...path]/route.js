import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API = process.env.API_BASE || 'http://localhost:3001';

export async function GET(req, { params }) { return forward(req, params); }
export async function POST(req, { params }) { return forward(req, params); }
export async function PUT(req, { params }) { return forward(req, params); }
export async function PATCH(req, { params }) { return forward(req, params); }
export async function DELETE(req, { params }) { return forward(req, params); }

async function forward(req, params) {
  try {
    const cookieStore = await cookies();
    const { path } = await params;
    const pathStr = Array.isArray(path) ? path.join('/') : path;
    const url = `${API}/${pathStr}`;
    const token = (await cookieStore.get('accessToken'))?.value;
    const isAuthEndpoint = pathStr === 'signin' || pathStr === 'signup' || pathStr === 'auth/login' || pathStr === 'auth/signup' || pathStr === 'auth/logout';
    const requestBody = ['GET', 'HEAD'].includes(req.method) ? undefined : await req.text();
    
    let r = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': req.headers.get('content-type') || 'application/json',
        ...(token && !isAuthEndpoint ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: requestBody,
      cache: 'no-store',
    });

  if (r.status === 401) {
      try {
      const rr = await fetch(`${new URL(req.url).origin}/api/refresh`, { 
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            // Forward client cookies so /api/refresh can read refreshToken
            Cookie: req.headers.get('cookie') || ''
          }
        });
        
      if (!rr.ok) {
        console.error('Token refresh failed with status:', rr.status);
          return new NextResponse(
            JSON.stringify({ error: 'Session expired. Please login again.' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
          );
        }
      // Prefer the token returned by the refresh endpoint so we don't rely on cookies mid-request
      let newToken = undefined;
      try {
        const refreshBody = await rr.json();
        newToken = refreshBody?.accessToken;
      } catch (_) {
        // ignore JSON parse errors, will fallback to cookies
      }
      if (!newToken) {
        const newCookieStore = await cookies();
        newToken = newCookieStore.get('accessToken')?.value;
      }
      if (!newToken) {
        console.error('No access token received after successful refresh');
        throw new Error('No access token after refresh');
      }

        r = await fetch(url, {
          method: req.method,
          headers: {
            'Content-Type': req.headers.get('content-type') || 'application/json',
            Authorization: `Bearer ${newToken}`,
          },
        body: requestBody,
          cache: 'no-store',
        });
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return new NextResponse(
          JSON.stringify({ error: 'Authentication failed' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    const body = await r.text();
    return new NextResponse(body, {
      status: r.status,
      headers: { 'Content-Type': r.headers.get('content-type') ?? 'application/json' },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
