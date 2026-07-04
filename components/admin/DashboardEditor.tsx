'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SiteContent } from '@/lib/site-content-schema';
import { SECTION_KEYS } from '@/lib/site-content-schema';
import type { StorageMode } from '@/lib/dashboard-storage';
import { useImagePicker } from '@/components/admin/fields';
import ImagePickerModal from '@/components/admin/ImagePickerModal';
import HomeTab from '@/components/admin/tabs/HomeTab';
import WorkTab from '@/components/admin/tabs/WorkTab';
import CaseStudiesTab from '@/components/admin/tabs/CaseStudiesTab';
import AboutTab from '@/components/admin/tabs/AboutTab';
import CreativeTab from '@/components/admin/tabs/CreativeTab';
import PlayTab from '@/components/admin/tabs/PlayTab';
import CopyTab from '@/components/admin/tabs/CopyTab';
import VisibilityTab from '@/components/admin/tabs/VisibilityTab';

const TABS = [
  { key: 'home', label: 'home' },
  { key: 'work', label: 'work' },
  { key: 'caseStudies', label: 'case studies' },
  { key: 'about', label: 'about' },
  { key: 'creative', label: 'creative' },
  { key: 'play', label: 'play' },
  { key: 'copy', label: 'copy' },
  { key: 'visibility', label: 'visibility' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const STORAGE_BADGE: Record<StorageMode, string> = {
  local: 'local · saves to disk',
  github: 'github · commits & redeploys',
  readonly: 'read-only',
};

export type Patch = (updater: (draft: SiteContent) => SiteContent) => void;

export default function DashboardEditor({
  initialContent,
  storageMode,
}: {
  initialContent: SiteContent;
  storageMode: StorageMode;
}) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [dirty, setDirty] = useState(false);
  const [tab, setTab] = useState<TabKey>('home');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | string>('idle');
  const picker = useImagePicker();

  const patch: Patch = (updater) => {
    setContent((prev) => updater(structuredClone(prev)));
    setDirty(true);
    if (saveState !== 'idle' && saveState !== 'saving') setSaveState('idle');
  };

  useEffect(() => {
    if (!dirty) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = '';
    }
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  async function handleSave() {
    setSaveState('saving');
    const res = await fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });

    if (res.ok) {
      setDirty(false);
      setSaveState('saved');
      setTimeout(() => setSaveState((s) => (s === 'saved' ? 'idle' : s)), 2000);
      return;
    }

    if (res.status === 401) {
      router.push('/dashboard/login');
      return;
    }

    const body = await res.json().catch(() => ({ error: 'save failed' }));
    if (res.status === 409) {
      setSaveState('( read-only on this deployment )');
    } else {
      setSaveState(body.error ?? 'save failed');
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/dashboard/login');
  }

  const saveDisabled = storageMode === 'readonly' || !dirty || saveState === 'saving';
  const saveLabel = saveState === 'saving' ? 'saving…' : saveState === 'saved' ? 'saved ✓' : 'save';
  const saveError = saveState !== 'idle' && saveState !== 'saving' && saveState !== 'saved' ? saveState : null;

  const tabProps = { content, patch, picker };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {picker.open && (
        <ImagePickerModal images={picker.images} onSelect={picker.select} onClose={picker.close} />
      )}

      <header
        className="flex items-center justify-between px-6 py-4 flex-wrap gap-3"
        style={{ borderBottom: '1px solid var(--color-line)', background: 'var(--color-surface)' }}
      >
        <div className="flex items-center gap-4">
          <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.5rem', color: 'var(--color-ink)' }}>
            dashboard
          </h1>
          <span className="u-eyebrow" style={{ color: 'var(--color-muted)' }}>
            {STORAGE_BADGE[storageMode]}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {saveError && (
            <span className="u-eyebrow" style={{ color: 'var(--color-pop-red)' }}>
              {saveError}
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saveDisabled}
            className="u-eyebrow"
            style={{
              background: 'var(--color-ink)',
              color: 'var(--color-surface)',
              padding: '0.55rem 1.1rem',
              opacity: saveDisabled ? 0.4 : 1,
              cursor: saveDisabled ? 'default' : 'pointer',
            }}
          >
            {saveLabel}
          </button>
          <button type="button" onClick={handleLogout} className="u-eyebrow">
            log out
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        <nav
          className="flex md:flex-col gap-1 p-4 flex-wrap md:flex-nowrap"
          style={{ borderRight: '1px solid var(--color-line)', minWidth: '12rem' }}
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className="u-eyebrow text-left px-2 py-1.5"
              style={{ color: tab === t.key ? 'var(--color-accent)' : 'var(--color-muted)' }}
            >
              {tab === t.key ? `( ${t.label} )` : t.label}
            </button>
          ))}
        </nav>

        <main className="flex-1 p-6" style={{ maxWidth: '52rem' }}>
          {tab === 'home' && <HomeTab {...tabProps} />}
          {tab === 'work' && <WorkTab {...tabProps} />}
          {tab === 'caseStudies' && <CaseStudiesTab {...tabProps} />}
          {tab === 'about' && <AboutTab {...tabProps} />}
          {tab === 'creative' && <CreativeTab {...tabProps} />}
          {tab === 'play' && <PlayTab {...tabProps} />}
          {tab === 'copy' && <CopyTab {...tabProps} />}
          {tab === 'visibility' && <VisibilityTab content={content} patch={patch} sectionKeys={SECTION_KEYS} />}
        </main>
      </div>
    </div>
  );
}
