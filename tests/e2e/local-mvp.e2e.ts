import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { buildAxisGaugeView } from '../../src/lib/shared/result-display';
import type { PublicResult, Scores } from '../../src/lib/shared/types';

const screenshotDir = 'tmp/screenshots';

test.beforeAll(() => {
  mkdirSync(screenshotDir, { recursive: true });
});

test('landing renders and has no Vite overlay', async ({ page }, testInfo) => {
  await page.goto('/');

  await expect(page.getByText('정답 없는 선택지')).toBeVisible();
  await expect(page.getByRole('heading', { name: '가치관 밸런스 체크' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: '닉네임' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: '닉네임' })).toBeEnabled();
  await expect(page.getByRole('button', { name: '테스트 시작하기' })).toBeEnabled();
  await expect(page.getByRole('link', { name: '이용약관' })).toBeVisible();
  await expect(page.getByRole('link', { name: '개인정보처리방침' })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'http://127.0.0.1:5173/');
  await expect(page.locator('meta[name="description"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'http://127.0.0.1:5173/og-image.svg'
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  const jsonLdTypes = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
    nodes.map((node) => JSON.parse(node.textContent ?? '{}')['@type'])
  );
  expect(jsonLdTypes).toEqual(expect.arrayContaining(['WebSite', 'WebApplication', 'Organization']));
  await expect(page.locator('.vite-error-overlay, #webpack-dev-server-client-overlay')).toHaveCount(0);

  await page.screenshot({
    path: `${screenshotDir}/landing-${testInfo.project.name}.png`,
    fullPage: true
  });
});

test('legal notice pages render from landing links', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('link', { name: '이용약관' }).click();

  await expect(page).toHaveURL(/\/terms$/);
  await expect(page.getByRole('heading', { name: '이용약관' })).toBeVisible();
  await expect(page.getByRole('link', { name: '개인정보처리방침 보기' })).toBeVisible();
  await expect(page.getByRole('link', { name: '개인정보처리방침 보기' })).toHaveAttribute('href', '/privacy');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'http://127.0.0.1:5173/terms');

  await page.goto('/privacy');
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.getByRole('heading', { name: '개인정보처리방침' })).toBeVisible();
  await expect(page.getByText('닉네임을 서버에 저장하지 않습니다')).toBeVisible();
  await expect(page.getByRole('link', { name: '이용약관 보기' })).toHaveAttribute('href', '/terms');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'http://127.0.0.1:5173/privacy');

  await page.screenshot({
    path: `${screenshotDir}/legal-pages-${testInfo.project.name}.png`,
    fullPage: true
  });
});

test('keyboard focus state is visible on interactive controls', async ({ page }) => {
  await page.goto('/');

  const nicknameInput = page.getByRole('textbox', { name: '닉네임' });
  const startButton = page.getByRole('button', { name: '테스트 시작하기' });

  await expect(nicknameInput).toBeEnabled();
  await expect(startButton).toBeEnabled();

  for (let index = 0; index < 6; index += 1) {
    if (await nicknameInput.evaluate((node) => document.activeElement === node).catch(() => false)) break;
    await page.keyboard.press('Tab');
  }

  await expect(nicknameInput).toBeFocused();
  const inputShadow = await nicknameInput.evaluate((node) => {
    return getComputedStyle(node).boxShadow;
  });
  expect(inputShadow).not.toBe('none');

  await page.keyboard.press('Tab');
  await expect(startButton).toBeFocused();
  const buttonShadow = await startButton.evaluate((node) => {
    return getComputedStyle(node).boxShadow;
  });
  expect(buttonShadow).not.toBe('none');
});

test('robots and sitemap expose only public static routes', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  expect(robots.headers()['content-type']).toContain('text/plain');
  const robotsText = await robots.text();
  expect(robotsText).toContain('User-agent: *');
  expect(robotsText).toContain('Allow: /');
  expect(robotsText).toContain('Disallow: /api/');
  expect(robotsText).toContain('Sitemap: http://127.0.0.1:5173/sitemap.xml');

  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  expect(sitemap.headers()['content-type']).toContain('application/xml');
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain('<loc>http://127.0.0.1:5173/</loc>');
  expect(sitemapText).toContain('<loc>http://127.0.0.1:5173/terms</loc>');
  expect(sitemapText).toContain('<loc>http://127.0.0.1:5173/privacy</loc>');
  expect(sitemapText).not.toContain('/test');
  expect(sitemapText).not.toContain('/result/');
});

test('private flow pages publish noindex robots meta', async ({ page }) => {
  await page.goto('/test?restart=1', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');

  await page.goto('/result/missing-local-id', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,follow');
});

test('unknown routes render recoverable noindex error page', async ({ page }, testInfo) => {
  await page.goto('/unknown-route');

  await expect(page.getByRole('heading', { name: '페이지를 찾을 수 없어요.' })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
  await page.getByRole('link', { name: '홈으로 이동' }).click();
  await expect(page).toHaveURL('/');

  await page.screenshot({
    path: `${screenshotDir}/not-found-${testInfo.project.name}.png`,
    fullPage: true
  });
});

test('20-question flow creates result and refresh recovers it', async ({ page }, testInfo) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  let submitBody: Record<string, unknown> | undefined;
  await page.route('**/api/submit-result', async (route) => {
    submitBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.continue();
  });

  await page.goto('/');
  await page.getByRole('textbox', { name: '닉네임' }).fill('테스터');
  await page.getByRole('button', { name: '테스트 시작하기' }).click();
  await page.waitForURL(/\/test/);
  await expect(page.getByRole('button', { name: /^A / })).toBeVisible();
  await page.evaluate(() => {
    sessionStorage.setItem('poldigm.startedAt', String(Date.now() - 25_000));
  });

  for (let index = 0; index < 20; index += 1) {
    await expect(page.getByText(`${index + 1}/20`)).toBeVisible();
    await expect(page.getByRole('button', { name: /^A / })).toBeVisible();
    await page.getByRole('button', { name: /^A / }).click();
    if (index < 19) {
      await expect(page.getByText(`${index + 2}/20`)).toBeVisible();
    }
  }

  await page.waitForURL('**/result/**', { timeout: 20_000 });
  await expect(page.getByText('테스터님의 사회적·정치적 가치관은')).toBeVisible();
  await expect(page.getByRole('heading', { name: '공동체의 원칙 설계자' })).toBeVisible();
  await expect(page.getByText('CTMO-S')).toBeVisible();
  await expect(page.getByText('Poldigm.com')).toBeVisible();
  expect(submitBody).not.toHaveProperty('nickname');

  await page.screenshot({
    path: `${screenshotDir}/result-${testInfo.project.name}.png`,
    fullPage: true
  });

  await page.reload();
  await expect(page.getByRole('heading', { name: '공동체의 원칙 설계자' })).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test('in-progress test recovers after refresh', async ({ page }, testInfo) => {
  await page.goto('/test?restart=1');
  await expect(page.getByText('1/20')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.getByRole('button', { name: /^A / }).click();
  await expect(page.getByText('2/20')).toBeVisible();
  const headingBeforeReload = await page.getByRole('heading', { level: 1 }).getAttribute('aria-label');

  await page.reload();

  await expect(page.getByText('2/20')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveAttribute('aria-label', headingBeforeReload ?? '');

  await page.screenshot({
    path: `${screenshotDir}/in-progress-recovery-${testInfo.project.name}.png`,
    fullPage: true
  });
});

test('missing result shows restart CTA', async ({ page }, testInfo) => {
  await page.goto('/result/missing-local-id');

  await expect(page.getByRole('heading', { name: '저장된 결과를 찾을 수 없어요.' })).toBeVisible();
  await expect(page.getByRole('link', { name: '테스트 다시 시작' })).toBeVisible();

  await page.screenshot({
    path: `${screenshotDir}/missing-result-${testInfo.project.name}.png`,
    fullPage: true
  });
});

test('result page recovers from sessionStorage fallback', async ({ page }, testInfo) => {
  const fallbackScores: Scores = { C: 40, I: 0, T: 40, P: 0, M: 40, E: 0, O: 40, L: 0 };
  const fallbackResult: PublicResult = {
    resultId: 'fallback-local-id',
    resultCode: 'CTMO-M',
    locale: 'ko-KR',
    scores: fallbackScores,
    resultViewModel: {
      typeCode: 'CTMO',
      intensityTag: 'M',
      title: '세션 복구 원칙 설계자',
      subtitle: 'mock 저장소 없이도 같은 세션에서는 결과를 복구합니다.',
      characterImg: 'character_CTMO.png',
      description: '이 결과는 sessionStorage fallback 검증을 위한 공개 결과 데이터입니다.',
      axisGauges: [
        buildAxisGaugeView({ left: 'C', right: 'I', scores: fallbackScores }),
        buildAxisGaugeView({ left: 'T', right: 'P', scores: fallbackScores }),
        buildAxisGaugeView({ left: 'M', right: 'E', scores: fallbackScores }),
        buildAxisGaugeView({ left: 'O', right: 'L', scores: fallbackScores })
      ],
      chemistryBest: 'ITEL',
      chemistryWorst: 'IPEL'
    }
  };

  await page.goto('/');
  await page.evaluate((result) => {
    sessionStorage.setItem('poldigm.lastResult', JSON.stringify(result));
  }, fallbackResult);
  await page.goto('/result/fallback-local-id');

  await expect(page.getByRole('heading', { name: '세션 복구 원칙 설계자' })).toBeVisible();
  await expect(page.getByText('CTMO-M')).toBeVisible();

  await page.screenshot({
    path: `${screenshotDir}/fallback-result-${testInfo.project.name}.png`,
    fullPage: true
  });
});
