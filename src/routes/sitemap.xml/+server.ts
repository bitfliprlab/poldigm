import { appBaseUrl } from '$lib/constants/runtime';

const PUBLIC_ROUTES = ['/', '/terms', '/privacy'] as const;

function absoluteUrl(path: string) {
  return `${appBaseUrl}${path === '/' ? '' : path}`;
}

export function GET() {
  const urls = PUBLIC_ROUTES.map((path) => `  <url><loc>${absoluteUrl(path)}</loc></url>`).join('\n');
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    ''
  ].join('\n');

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8'
    }
  });
}
