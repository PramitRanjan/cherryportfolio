import { redirect } from 'next/navigation';
import { isAdminSession } from '@/lib/admin-auth';
import DashboardLoginForm from '@/components/admin/DashboardLoginForm';

export const metadata = {
  robots: { index: false, follow: false },
  title: 'Dashboard login',
};
export const dynamic = 'force-dynamic';

const HANDLE_POSITIONS = [
  { top: 0, left: 0, translate: '-50%, -50%' },
  { top: 0, right: 0, translate: '50%, -50%' },
  { bottom: 0, left: 0, translate: '-50%, 50%' },
  { bottom: 0, right: 0, translate: '50%, 50%' },
] as const;

export default async function DashboardLoginPage() {
  if (await isAdminSession()) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--color-bg)' }}>
      <div
        className="relative w-full"
        style={{ maxWidth: '24rem' }}
      >
        <div
          className="relative px-8 py-10"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-line)',
            boxShadow: '0 1px 3px rgba(33,29,24,.08), 0 4px 12px rgba(33,29,24,.06)',
          }}
        >
          {HANDLE_POSITIONS.map((pos, i) => (
            <span
              key={i}
              aria-hidden="true"
              style={{
                position: 'absolute',
                width: 8,
                height: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-accent-2)',
                pointerEvents: 'none',
                top: 'top' in pos ? pos.top : undefined,
                bottom: 'bottom' in pos ? pos.bottom : undefined,
                left: 'left' in pos ? pos.left : undefined,
                right: 'right' in pos ? pos.right : undefined,
                transform: `translate(${pos.translate})`,
              }}
            />
          ))}

          <p className="u-eyebrow mb-3">( the dashboard )</p>
          <h1
            className="mb-8"
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '2rem',
              color: 'var(--color-ink)',
            }}
          >
            hi cherry
          </h1>

          <DashboardLoginForm />
        </div>
      </div>
    </main>
  );
}
