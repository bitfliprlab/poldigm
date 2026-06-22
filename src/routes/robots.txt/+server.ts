import { appBaseUrl } from '$lib/constants/runtime';

export function GET() {
  const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${appBaseUrl}/sitemap.xml`, ''].join('\n');

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8'
    }
  });
}
