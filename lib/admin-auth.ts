/**
 * Dashboard session auth via an HMAC-signed cookie. No `server-only`
 * import here — the pure token helpers are unit-tested directly, and
 * `next/headers` is only touched inside the async functions below.
 */
import { cookies } from 'next/headers';
import { signSession, verifySessionToken } from '@/lib/admin-auth-token';

export { signSession, verifySessionToken } from '@/lib/admin-auth-token';

const COOKIE_NAME = 'cherry_admin';
const SESSION_MS = 14 * 24 * 60 * 60 * 1000;

export async function createAdminSession(): Promise<void> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set');

  const token = signSession(Date.now() + SESSION_MS, secret);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MS / 1000,
  });
}

export async function isAdminSession(): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;

  return verifySessionToken(token, secret);
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
