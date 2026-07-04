/**
 * Pure session-token helpers, no next/headers import so this can be
 * unit-tested directly under `node --test` without pulling in Next's
 * module resolution.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

function hmacHex(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('hex');
}

/** `${expiresAtMs}.${hmacHex}` — signs the expiry so the cookie can't be forged or extended. */
export function signSession(expiresAtMs: number, secret: string): string {
  return `${expiresAtMs}.${hmacHex(String(expiresAtMs), secret)}`;
}

/** Verifies shape, expiry, and signature (timing-safe). */
export function verifySessionToken(token: string, secret: string, now: number = Date.now()): boolean {
  const dot = token.indexOf('.');
  if (dot <= 0) return false;
  const expPart = token.slice(0, dot);
  const sigPart = token.slice(dot + 1);
  if (!expPart || !sigPart) return false;

  const exp = Number(expPart);
  if (!Number.isFinite(exp)) return false;
  if (now >= exp) return false;

  const expected = hmacHex(expPart, secret);
  const a = Buffer.from(sigPart, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length === 0 || a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
