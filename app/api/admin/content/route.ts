import { NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/admin-auth';
import { assertSiteContent } from '@/lib/site-content-schema';
import { persistContent } from '@/lib/dashboard-storage';

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
    assertSiteContent(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'invalid content';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const { mode } = await persistContent(body);
    return NextResponse.json({ ok: true, mode });
  } catch (err) {
    if (err instanceof Error && err.message === 'readonly') {
      return NextResponse.json({ error: 'read-only on this deployment' }, { status: 409 });
    }
    throw err;
  }
}
