import { describe, expect, it } from 'vitest';
import { questions } from '../../src/lib/server/data/questions.ko-KR';
import { nextQuestion } from '../../src/lib/server/algorithm/questions';
import { validateQuestionPool, validateReachableHistory } from '../../src/lib/server/algorithm/validation';
import { balancedCiHistory } from '../helpers/fixtures';

describe('question pool and nextQuestion', () => {
  it('has the required 44 local MVP slots', () => {
    expect(() => validateQuestionPool()).not.toThrow();
    expect(questions).toHaveLength(44);
  });

  it('returns the first Phase 1 question for empty history without internal fields', () => {
    const response = nextQuestion([]);

    expect(response.status).toBe('in_progress');
    if (response.status !== 'in_progress') throw new Error('unexpected completed response');

    expect(response.question.id).toBe('Q_1_C_I_1');
    expect(response.question.progress.current).toBe(1);
    expect(response.question).not.toHaveProperty('scoreEffect');
    expect(response.question).not.toHaveProperty('branchCondition');
    expect(response.question).not.toHaveProperty('intensityEffect');
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
