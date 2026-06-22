import { describe, expect, it } from 'vitest';
import { POST } from '../../src/routes/api/next-question/+server';
import { allLeftStrongHistory } from '../helpers/fixtures';

async function postNextQuestion(body: Record<string, unknown>) {
  return POST({
    request: new Request('http://localhost/api/next-question', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
  } as never) as Promise<Response>;
}

async function postRawNextQuestion(body: string) {
  return POST({
    request: new Request('http://localhost/api/next-question', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' }
    })
  } as never) as Promise<Response>;
}

function expectNoInternalQuestionFields(value: unknown): void {
  if (!value || typeof value !== 'object') return;

  if (Array.isArray(value)) {
    for (const item of value) expectNoInternalQuestionFields(item);
    return;
  }

  const record = value as Record<string, unknown>;
  expect(record).not.toHaveProperty('scoreEffect');
  expect(record).not.toHaveProperty('branchCondition');
  expect(record).not.toHaveProperty('intensityEffect');
  expect(record).not.toHaveProperty('metadata');

  for (const nested of Object.values(record)) {
    expectNoInternalQuestionFields(nested);
  }
}

describe('/api/next-question', () => {
  it('returns the public display model without internal algorithm fields', async () => {
    const response = await postNextQuestion({ history: [] });

    expect(response.status).toBe(200);
    const payload = await response.json();

    expect(payload.status).toBe('in_progress');
    expect(Object.keys(payload.question).toSorted()).toEqual([
      'axis',
      'choices',
      'display',
      'id',
      'phase',
      'progress',
      'prompt'
    ]);
    expect(payload.question.display.promptLines).toHaveLength(2);
    expect(payload.question.display.promptLines.join(' ')).toContain(
      payload.question.display.promptHighlights[0]
    );
    expect(payload.question.display.choices.A.label.length).toBeGreaterThan(0);
    expect(payload.question.display.choices.A.body).toBe(payload.question.choices.A);
    expect(payload.question.display.choices.A.highlights.length).toBeGreaterThan(0);
    expectNoInternalQuestionFields(payload);
  });

  it('uses questionSeed to pick a deterministic variant within the same slot', async () => {
    const seen = new Set<string>();

    for (let index = 0; index < 20; index += 1) {
      const response = await postNextQuestion({ history: [], questionSeed: `seed-${index}` });
      expect(response.status).toBe(200);
      const payload = await response.json();

      expect(payload.question.id).toMatch(/^Q_1_C_I_1(_V\d+)?$/);
      seen.add(payload.question.id);
    }

    expect(seen.has('Q_1_C_I_1')).toBe(true);
    expect(seen.has('Q_1_C_I_1_V2')).toBe(true);
  });

  it('rejects an unreachable variant id from the wrong slot', async () => {
    const response = await postNextQuestion({
      history: [{ questionId: 'Q_2_C_1_V2', choice: 'A' }],
      questionSeed: 'seed-1'
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: 'validation_error' }
    });
  });

  it('returns a completed action after exactly 20 reachable answers', async () => {
    const response = await postNextQuestion({
      history: allLeftStrongHistory()
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: 'completed',
      nextAction: 'submit_result'
    });
  });

  it('returns validation_error for invalid JSON request bodies', async () => {
    const response = await postRawNextQuestion('{not-json');

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: 'validation_error' }
    });
  });
});
