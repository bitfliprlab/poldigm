export function GET() {
  return new Response('google-site-verification: googlec88289d13cb80e42.html', {
    headers: {
      'content-type': 'text/html; charset=utf-8'
    }
  });
}
