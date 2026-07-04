import { NextResponse } from 'next/server';
import { constantTimeEqual } from '@/lib/security';
import { createAdminSession } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: 'not configured' }, { status: 500 });
  }

  let password = '';
  try {
    const body = await request.json();
    if (body && typeof body === 'object' && typeof body.password === 'string') {
      password = body.password;
    }
  } catch {
    // malformed body — falls through to the wrong-password path
  }

  if (!constantTimeEqual(password, adminPassword)) {
    return NextResponse.json({ error: 'wrong password' }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
