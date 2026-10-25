import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Serve the standalone document so its globe, fonts and styles stay isolated
// from the main site's React layout. Next prerenders it during the build.
export const dynamic = 'force-static';

export async function GET() {
  const html = await readFile(join(process.cwd(), 'public/eventpage/bayarea/index.html'), 'utf8');

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
