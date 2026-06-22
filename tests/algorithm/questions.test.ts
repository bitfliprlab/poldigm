import { describe, expect, it } from 'vitest';
import type { AnswerHistoryItem } from '../../src/lib/shared/types';
import { allQuestions, questionVariants, questions, questionsBySlotId } from '../../src/lib/server/data/questions.ko-KR';
import { computeResultCode } from '../../src/lib/server/algorithm/scoring';
import { getQuestionById, nextQuestion } from '../../src/lib/server/algorithm/questions';
import { validateQuestionPool, validateReachableHistory } from '../../src/lib/server/algorithm/validation';
import { balancedCiHistory } from '../helpers/fixtures';

describe('question pool and nextQuestion', () => {
  it('has the required 44 local MVP slots and 132 reusable candidates', () => {
    expect(() => validateQuestionPool()).not.toThrow();
    expect(questions).toHaveLength(44);
    expect(questionVariants).toHaveLength(88);
    expect(allQuestions).toHaveLength(132);

    for (const question of questions) {
      const variants = questionsBySlotId.get(question.id) ?? [];
      expect(variants).toHaveLength(3);
      expect(new Set(variants.map((variant) => variant.metadata.scenarioTag)).size).toBeGreaterThanOrEqual(2);
    }
  });

  it('returns the first Phase 1 question for empty history without internal fields', () => {
    const response = nextQuestion([]);

    expect(response.status).toBe('in_progress');
    if (response.status !== 'in_progress') throw new Error('unexpected completed response');

    expect(response.question.id).toBe('Q_1_C_I_1');
    expect(response.question.progress.current).toBe(1);
    expect(response.question.display.promptLines).toHaveLength(2);
    expect(response.question.display.choices.A.label).toBeTruthy();
    expect(response.question.display.choices.A.body).toBe(response.question.choices.A);
    expect(response.question).not.toHaveProperty('scoreEffect');
    expect(response.question).not.toHaveProperty('branchCondition');
    expect(response.question).not.toHaveProperty('intensityEffect');
  });

  it('can pick a seeded variant within the same algorithm slot', () => {
    const ids = new Set<string>();

    expect(questionVariants.length).toBeGreaterThan(0);

    for (let index = 0; index < 20; index += 1) {
      const response = nextQuestion([], `seed-${index}`);
      expect(response.status).toBe('in_progress');
      if (response.status !== 'in_progress') throw new Error('unexpected completed response');
      expect(response.question.id).toMatch(/^Q_1_C_I_1(_V\d+)?$/);
      ids.add(response.question.id);
    }

    expect(ids.has('Q_1_C_I_1')).toBe(true);
    expect(ids.has('Q_1_C_I_1_V2')).toBe(true);
    expect(ids.has('Q_1_C_I_1_V3')).toBe(true);
  });

  it('accepts a full seeded variant flow as reachable history', () => {
    const history: AnswerHistoryItem[] = [];

    for (let index = 0; index < 20; index += 1) {
      const response = nextQuestion(history, 'stable-variant-seed');
      expect(response.status).toBe('in_progress');
      if (response.status !== 'in_progress') throw new Error('unexpected completed response');

      history.push({
        questionId: response.question.id,
        choice: 'A' as const
      });
    }

    expect(history.some((answer) => /_V[23]$/.test(answer.questionId))).toBe(true);
    expect(() => validateReachableHistory(history, { allowComplete: true })).not.toThrow();
    expect(computeResultCode(history).resultCode).toBe('CTMO-S');
  });

  it('balances display metadata across a seeded 20-question flow', () => {
    const history: AnswerHistoryItem[] = [];

    for (let index = 0; index < 20; index += 1) {
      const response = nextQuestion(history, 'copy-family-balance-seed');
      expect(response.status).toBe('in_progress');
      if (response.status !== 'in_progress') throw new Error('unexpected completed response');

      history.push({
        questionId: response.question.id,
        choice: 'A' as const
      });
    }

    const copyFamilyCounts = history.reduce<Record<string, number>>((acc, answer) => {
      const metadata = getQuestionById(answer.questionId).metadata;
      acc[metadata.copyFamily] = (acc[metadata.copyFamily] ?? 0) + 1;
      return acc;
    }, {});
    const scenarioTags = new Set(history.map((answer) => getQuestionById(answer.questionId).metadata.scenarioTag));
    const copyFamilyValues = Object.values(copyFamilyCounts);

    expect(Object.keys(copyFamilyCounts).toSorted()).toEqual(['base-copy', 'variant-v2', 'variant-v3']);
    expect(Math.max(...copyFamilyValues) - Math.min(...copyFamilyValues)).toBeLessThanOrEqual(1);
    expect(scenarioTags.size).toBeGreaterThanOrEqual(8);
  });

  it('avoids recently used scenario frames when copy-family usage is already balanced', () => {
    const history: AnswerHistoryItem[] = [
      { questionId: 'Q_1_C_I_1', choice: 'A' },
      { questionId: 'Q_1_T_P_1_V2', choice: 'A' },
      { questionId: 'Q_1_M_E_1_V3', choice: 'A' }
    ];

    for (const seed of ['recent-frame-1', 'recent-frame-2', 'recent-frame-3']) {
      const response = nextQuestion(history, seed);
      expect(response.status).toBe('in_progress');
      if (response.status !== 'in_progress') throw new Error('unexpected completed response');

      const metadata = getQuestionById(response.question.id).metadata;
      expect(response.question.id).toMatch(/^Q_1_O_L_1(_V\d+)?$/);
      expect(metadata.scenarioTag).toBe('public-space');
      expect(metadata.scenarioTag).not.toBe(getQuestionById('Q_1_M_E_1_V3').metadata.scenarioTag);
    }
  });

  it('uses BALANCED branch when Phase 1 for an axis is split', () => {
    const historyAfterPhase1 = balancedCiHistory().slice(0, 8);
    const response = nextQuestion(historyAfterPhase1);

    expect(response.status).toBe('in_progress');
    if (response.status !== 'in_progress') throw new Error('unexpected completed response');

    expect(response.question.id).toBe('Q_2_CI_BAL_1');
  });

  it('rejects duplicate question ids', () => {
    expect(() =>
      validateReachableHistory(
        [
          { questionId: 'Q_1_C_I_1', choice: 'A' },
          { questionId: 'Q_1_C_I_1', choice: 'B' }
        ],
        { allowComplete: true }
      )
    ).toThrow('중복 문항 ID');
  });

  it('rejects unreachable phase 2 order', () => {
    expect(() =>
      validateReachableHistory(
        [
          { questionId: 'Q_1_C_I_1', choice: 'A' },
          { questionId: 'Q_2_C_1', choice: 'A' }
        ],
        { allowComplete: true }
      )
    ).toThrow('도달 불가능');
  });
});
