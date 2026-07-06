/**
 * Where dashboard saves land: local disk in dev, a GitHub commit in
 * prod (triggers a Vercel redeploy), or nowhere if neither is wired up.
 * No `server-only` import — unit-tested directly.
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { SiteContent } from '@/lib/site-content-schema';
import { isGitHubDashboardPublishConfigured } from './github-publish-config.ts';

export type StorageMode = 'local' | 'github' | 'readonly';

export function resolveStorageMode(env: Record<string, string | undefined> = process.env): StorageMode {
  if (isGitHubDashboardPublishConfigured(env)) return 'github';
  if (!env.VERCEL) return 'local';
  return 'readonly';
}

export async function persistContent(content: SiteContent): Promise<{ mode: StorageMode }> {
  const mode = resolveStorageMode();
  const json = JSON.stringify(content, null, 2) + '\n';

  if (mode === 'local') {
    await writeFile(path.join(process.cwd(), 'content/site-content.json'), json);
    return { mode };
  }

  if (mode === 'github') {
    const { commitContentToGitHub } = await import('./github-content');
    await commitContentToGitHub(json);
    return { mode };
  }

  throw new Error('readonly');
}
