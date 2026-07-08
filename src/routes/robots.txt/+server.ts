import { absoluteUrl } from '$lib/shared/seo';

export function GET() {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /test',
    'Disallow: /result/',
    '',
    `Sitemap: ${absoluteUrl('/sitemap.xml')}`,
    ''
  ].join('\n');

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8'
    }
  });
}
