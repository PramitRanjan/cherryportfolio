'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type NavLink = { key: string; label: string; href: string };

const EASE_DRIFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

function FlowerMark() {
  return (
    <span
      aria-hidden="true"
      className="ml-1 inline-flex h-[1em] w-[1em] items-center justify-center font-sans not-italic leading-none text-[color:var(--color-accent)]"
      style={{ fontSize: '0.78em' }}
    >
      ✿
    </span>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavInner({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // close mobile overlay on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500"
      style={{
        borderBottom: `1px solid ${scrolled ? 'var(--color-line)' : 'transparent'}`,
        backgroundColor: scrolled ? 'color-mix(in srgb, var(--color-bg) 82%, transparent)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transitionDuration: 'var(--motion-med)',
        transitionTimingFunction: 'var(--ease-drift)',
      }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6"
      >
        <Link
          href="/"
          className="flex items-center font-serif text-[1.25rem] italic text-[color:var(--color-ink)]"
        >
          cherry phan
          <FlowerMark />
        </Link>

        {/* desktop links */}
        <ul className="hidden items-center gap-7 md:flex">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className="group font-mono text-[length:var(--text-meta)] lowercase tracking-[0.08em] transition-colors"
                  style={{
                    color: active ? 'var(--color-accent)' : 'var(--color-body)',
                    transitionDuration: 'var(--motion-fast)',
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="transition-opacity group-hover:opacity-100"
                    style={{ opacity: active ? 1 : 0, transitionDuration: 'var(--motion-fast)' }}
                  >
                    ({' '}
                  </span>
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="transition-opacity group-hover:opacity-100"
                    style={{ opacity: active ? 1 : 0, transitionDuration: 'var(--motion-fast)' }}
                  >
                    {' '})
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* mobile trigger */}
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center font-mono text-[length:var(--text-meta)] lowercase tracking-[0.08em] text-[color:var(--color-ink)] transition-[color,scale] active:scale-[0.96] md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-overlay"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? '( close )' : '( menu )'}
        </button>
      </nav>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            id="mobile-nav-overlay"
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex min-h-[100dvh] flex-col items-start justify-start overflow-y-auto overscroll-contain bg-[color:var(--color-bg)] px-8 md:hidden"
            initial={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.6, ease: EASE_DRIFT }}
            style={{
              paddingTop: 'calc(5.5rem + env(safe-area-inset-top))',
              paddingBottom: 'max(2rem, calc(1.5rem + env(safe-area-inset-bottom)))',
            }}
          >
            <div aria-hidden="true" className="u-gridlines absolute inset-0 opacity-[0.28]" />
            <button
              type="button"
              className="absolute right-6 top-5 z-10 inline-flex min-h-11 items-center justify-center font-mono text-[length:var(--text-meta)] lowercase tracking-[0.08em] text-[color:var(--color-ink)] transition-[color,scale] active:scale-[0.96]"
              onClick={() => setMenuOpen(false)}
              style={{ top: 'calc(1.1rem + env(safe-area-inset-top))' }}
            >
              ( close )
            </button>

            <div className="relative z-10 flex min-h-full w-full flex-col justify-center gap-5 py-4">
              {links.map((link, i) => {
                const active = isActive(pathname, link.href);
                return (
                  <motion.div
                    key={link.key}
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.6,
                      ease: EASE_DRIFT,
                      delay: reduceMotion ? 0 : 0.08 * i,
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="relative z-10 font-serif text-[length:var(--text-h1)] italic leading-none transition-[color,scale] active:scale-[0.96]"
                      style={{ color: active ? 'var(--color-accent)' : 'var(--color-ink)' }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
