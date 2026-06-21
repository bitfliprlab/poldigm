import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const screenshotDir = 'tmp/screenshots';

test.beforeAll(() => {
  mkdirSync(screenshotDir, { recursive: true });
});

test('landing renders and has no Vite overlay', async ({ page }, testInfo) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: '당신에게 도착한 20문항.' })).toBeVisible();
  await expect(page.getByRole('button', { name: '테스트 시작하기' })).toBeVisible();
  await expect(page.locator('.vite-error-overlay, #webpack-dev-server-client-overlay')).toHaveCount(0);

  await page.screenshot({
    path: `${screenshotDir}/landing-${testInfo.project.name}.png`,
    fullPage: true
  });
});

test('20-question flow creates result and refresh recovers it', async ({ page }, testInfo) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.goto('/');
  await page.getByRole('button', { name: '테스트 시작하기' }).click();
  await page.waitForURL(/\/test/);
  await expect(page.getByRole('button', { name: /^A / })).toBeVisible();
  await page.evaluate(() => {
    sessionStorage.setItem('poldigm.startedAt', String(Date.now() - 25_000));
  });

  for (let index = 0; index < 20; index += 1) {
    await expect(page.getByRole('button', { name: /^A / })).toBeVisible();
    await page.getByRole('button', { name: /^A / }).click();
  }

  await page.waitForURL('**/result/**', { timeout: 20_000 });
  await expect(page.getByRole('heading', { name: '공동체의 원칙 설계자' })).toBeVisible();
  await expect(page.getByText('CTMO-S')).toBeVisible();
  await expect(page.getByText('Poldigm.com')).toBeVisible();

  await page.screenshot({
    path: `${screenshotDir}/result-${testInfo.project.name}.png`,
    fullPage: true
  });

  await page.reload();
  await expect(page.getByRole('heading', { name: '공동체의 원칙 설계자' })).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test('in-progress test recovers after refresh', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('button', { name: '테스트 시작하기' }).click();
  await page.waitForURL(/\/test/);
  await expect(
    page.getByRole('heading', { name: '공동의 안전과 개인의 사생활이 충돌할 때 더 가까운 기준을 고릅니다.' })
  ).toBeVisible();

  await page.getByRole('button', { name: /^A / }).click();
  await expect(
    page.getByRole('heading', { name: '오래 이어진 관습과 새로운 생활 방식이 충돌하는 장면입니다.' })
  ).toBeVisible();

  await page.reload();

  await expect(page.getByText('2/20')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: '오래 이어진 관습과 새로운 생활 방식이 충돌하는 장면입니다.' })
  ).toBeVisible();

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
  const fallbackResult = {
    resultId: 'fallback-local-id',
    resultCode: 'CTMO-M',
    locale: 'ko-KR',
    scores: { C: 40, I: 0, T: 40, P: 0, M: 40, E: 0, O: 40, L: 0 },
    resultViewModel: {
      typeCode: 'CTMO',
      intensityTag: 'M',
      title: '세션 복구 원칙 설계자',
      subtitle: 'mock 저장소 없이도 같은 세션에서는 결과를 복구합니다.',
      characterImg: 'character_CTMO.png',
      description: '이 결과는 sessionStorage fallback 검증을 위한 공개 결과 데이터입니다.',
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
