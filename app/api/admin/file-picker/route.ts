import { NextResponse } from 'next/server';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { isAdminSession } from '@/lib/admin-auth';

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg', '.gif']);

async function walk(dir: string, root: string): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full, root)));
    } else if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      const rel = path.relative(root, full).split(path.sep).join('/');
      files.push(`/${rel}`);
    }
  }
  return files;
}

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const publicDir = path.join(process.cwd(), 'public');
  const images = (await walk(publicDir, publicDir)).sort();
  return NextResponse.json({ images });
}
