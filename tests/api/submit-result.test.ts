import { describe, expect, it } from 'vitest';
import { POST } from '../../src/routes/api/submit-result/+server';
import { buildAxisGaugeView } from '../../src/lib/shared/result-display';
import type { PublicResult } from '../../src/lib/shared/types';
import { canUseLocalMockTurnstile } from '../../src/lib/server/bot/mock-turnstile';
import { getLocalResult } from '../../src/lib/server/storage/mock-results';
import { allLeftStrongHistory } from '../helpers/fixtures';

async function postSubmit(body: Record<string, unknown>) {
  return POST({
    request: new Request('http://localhost/api/submit-result', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
  } as never) as Promise<Response>;
}

async function postRawSubmit(body: string) {
  return POST({
    request: new Request('http://localhost/api/submit-result', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' }
    })
  } as never) as Promise<Response>;
}

function expectNoInternalResultFields(value: unknown): void {
  if (!value || typeof value !== 'object') return;

  if (Array.isArray(value)) {
    for (const item of value) expectNoInternalResultFields(item);
    return;
  }

  const record = value as Record<string, unknown>;
  for (const internalField of [
    'scoreEffect',
    'branchCondition',
    'intensityEffect',
    'metadata',
    'history',
    'turnstileToken',
    'playTimeSec',
    'deviceType',
    'utmSource'
  ]) {
    expect(record).not.toHaveProperty(internalField);
  }

  for (const nested of Object.values(record)) {
    expectNoInternalResultFields(nested);
  }
}

describe('/api/submit-result', () => {
  it('allows the local mock Turnstile token only in local dev runtime', () => {
    expect(canUseLocalMockTurnstile({ isDev: true, isLocal: true })).toBe(true);
    expect(canUseLocalMockTurnstile({ isDev: false, isLocal: true })).toBe(false);
    expect(canUseLocalMockTurnstile({ isDev: true, isLocal: false })).toBe(false);
  });

  it('rejects history lengths other than 20', async () => {
    const shortResponse = await postSubmit({
      history: allLeftStrongHistory().slice(0, 19),
      turnstileToken: 'local-mock-token',
      playTimeSec: 30
    });

    const longResponse = await postSubmit({
      history: [...allLeftStrongHistory(), { questionId: 'Q_EXTRA', choice: 'A' }],
      turnstileToken: 'local-mock-token',
      playTimeSec: 30
    });

    expect(shortResponse.status).toBe(400);
    expect(longResponse.status).toBe(400);
  });

  it('rejects too-fast play time', async () => {
    const response = await postSubmit({
      history: allLeftStrongHistory(),
      turnstileToken: 'local-mock-token',
      playTimeSec: 19
    });

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: 'abuse_suspected' }
    });
  });

  it('rejects a failed bot verification token with bot_verification_failed', async () => {
    const response = await postSubmit({
      history: allLeftStrongHistory(),
      turnstileToken: 'invalid-token',
      playTimeSec: 30
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: 'bot_verification_failed' }
    });
  });

  it('returns validation_error for non-object JSON request bodies', async () => {
    const response = await postRawSubmit('[]');

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: 'validation_error' }
    });
  });

  it('accepts local mock Turnstile and stores a public result', async () => {
    const response = await postSubmit({
      history: allLeftStrongHistory(),
      turnstileToken: 'local-mock-token',
      playTimeSec: 30,
      deviceType: 'Desktop'
    });

    expect(response.status).toBe(200);
    const result = await response.json() as PublicResult;
    expect(result.resultCode).toBe('CTMO-S');
    expect(Object.keys(result).toSorted()).toEqual([
      'locale',
      'resultCode',
      'resultId',
      'resultViewModel',
      'scores'
    ]);
    expect(Object.keys(result.resultViewModel).toSorted()).toEqual([
      'axisGauges',
      'characterImg',
      'chemistryBest',
      'chemistryWorst',
      'description',
      'intensityTag',
      'subtitle',
      'title',
      'typeCode'
    ]);
    expectNoInternalResultFields(result);
    expect(result.resultViewModel.axisGauges).toHaveLength(4);
    expect(result.resultViewModel.axisGauges[0]).toEqual(
      buildAxisGaugeView({ left: 'C', right: 'I', scores: result.scores })
    );
    expect(getLocalResult(result.resultId)).toMatchObject({
      resultId: result.resultId,
      resultCode: 'CTMO-S'
    });
  });
});
