'use client';

import { createContext, useContext } from 'react';
import type { SiteContent } from '@/lib/site-content-schema';

const SiteCopyContext = createContext<SiteContent['copy'] | null>(null);

export function SiteCopyProvider({
  copy,
  children,
}: {
  copy: SiteContent['copy'];
  children: React.ReactNode;
}) {
  return <SiteCopyContext.Provider value={copy}>{children}</SiteCopyContext.Provider>;
}

export function useSiteCopy(): SiteContent['copy'] {
  const ctx = useContext(SiteCopyContext);
  if (!ctx) throw new Error('useSiteCopy must be used within a SiteCopyProvider');
  return ctx;
}
