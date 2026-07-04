import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

/** Same glyph as the marquee/logo/cursor. */
export default async function Icon() {
  const icon = await readFile(join(process.cwd(), 'public', 'cursor-blossom.png'));

  return new Response(icon, {
    headers: {
      'content-type': contentType,
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
}
