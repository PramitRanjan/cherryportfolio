'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type Status = 'idle' | 'pending' | 'wrong-password' | 'not-configured';

export default function DashboardLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('pending');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/dashboard');
      router.refresh();
      return;
    }

    setStatus(res.status === 500 ? 'not-configured' : 'wrong-password');
  }

  const pending = status === 'pending';

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="password" className="u-eyebrow block mb-2">
        password
      </label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
        className="w-full mb-4"
        style={{
          border: '1px solid var(--color-line)',
          background: 'var(--color-surface)',
          padding: '0.65rem 0.85rem',
          color: 'var(--color-ink)',
          fontFamily: 'var(--font-sans)',
        }}
      />

      {status === 'wrong-password' && (
        <p className="u-eyebrow mb-4" style={{ color: 'var(--color-pop-red)' }}>
          ( that&apos;s not it — try again )
        </p>
      )}
      {status === 'not-configured' && (
        <p className="u-eyebrow mb-4" style={{ color: 'var(--color-pop-red)' }}>
          ( dashboard isn&apos;t configured — see .env.example )
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="u-eyebrow"
        style={{
          background: 'var(--color-ink)',
          color: 'var(--color-surface)',
          padding: '0.625rem 1.25rem',
          opacity: pending ? 0.6 : 1,
          cursor: pending ? 'default' : 'pointer',
          transition: 'opacity var(--motion-fast) var(--ease-settle)',
        }}
        onMouseEnter={(e) => {
          if (!pending) e.currentTarget.style.opacity = '0.85';
        }}
        onMouseLeave={(e) => {
          if (!pending) e.currentTarget.style.opacity = '1';
        }}
      >
        {pending ? 'checking…' : 'come in'}
      </button>
    </form>
  );
}
