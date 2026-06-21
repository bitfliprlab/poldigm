import { describe, expect, it } from 'vitest';
import { POST } from '../../src/routes/api/submit-result/+server';
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

describe('/api/submit-result', () => {
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

  it('accepts local mock Turnstile and stores a public result', async () => {
    const response = await postSubmit({
      history: allLeftStrongHistory(),
      turnstileToken: 'local-mock-token',
      playTimeSec: 30,
      deviceType: 'Desktop'
    });

    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.resultCode).toBe('CTMO-S');
    expect(result.resultViewModel).not.toHaveProperty('scoreEffect');
    expect(getLocalResult(result.resultId)).toMatchObject({
      resultId: result.resultId,
      resultCode: 'CTMO-S'
    });
  });
});
