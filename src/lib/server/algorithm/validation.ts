import { AXIS_ORDER, AXIS_SIDES, TOTAL_QUESTION_COUNT } from '$lib/shared/constants';
import type { AnswerHistoryItem, Axis, BranchCondition } from '$lib/shared/types';
import { questions } from '$lib/server/data/questions.ko-KR';
import type { QuestionDefinition } from '$lib/server/data/types';
import { expectedQuestionAtIndex, getQuestionById, slotIdForQuestion } from './questions';
import { validationProblem } from './errors';

export function parseHistory(input: unknown): AnswerHistoryItem[] {
  if (!Array.isArray(input)) throw validationProblem('history는 배열이어야 합니다.');

  return input.map((item) => {
    if (!item || typeof item !== 'object') {
      throw validationProblem('history 항목 형식이 올바르지 않습니다.');
    }

    const raw = item as Partial<AnswerHistoryItem>;
    if (typeof raw.questionId !== 'string') {
      throw validationProblem('questionId가 필요합니다.');
    }
    if (raw.choice !== 'A' && raw.choice !== 'B') {
      throw validationProblem('choice는 A 또는 B여야 합니다.');
    }
    if (raw.answeredAt !== undefined && typeof raw.answeredAt !== 'string') {
      throw validationProblem('answeredAt 형식이 올바르지 않습니다.');
    }

    return {
      questionId: raw.questionId,
      choice: raw.choice,
      answeredAt: raw.answeredAt
    };
  });
}

export function validateReachableHistory(
  history: AnswerHistoryItem[],
  options: { allowComplete: boolean }
): void {
  const maxLength = options.allowComplete ? TOTAL_QUESTION_COUNT : TOTAL_QUESTION_COUNT - 1;
  if (history.length > maxLength) {
    throw validationProblem('history 길이가 허용 범위를 초과했습니다.');
  }

  const seen = new Set<string>();
  for (let index = 0; index < history.length; index += 1) {
    const answer = history[index];
    const answeredQuestion = getQuestionById(answer.questionId);

    if (seen.has(answer.questionId)) {
      throw validationProblem('중복 문항 ID가 포함되어 있습니다.');
    }
    seen.add(answer.questionId);

    const expected = expectedQuestionAtIndex(history.slice(0, index));
    if (slotIdForQuestion(answeredQuestion) !== slotIdForQuestion(expected)) {
      throw validationProblem('도달 불가능한 문항 순서입니다.');
    }
  }
}

function branchConditionsForAxis(axis: Axis): BranchCondition[] {
  const [left, right] = AXIS_SIDES[axis];
  return [left, right, 'BALANCED'];
}

function validateQuestion(question: QuestionDefinition): void {
  if (!AXIS_ORDER.includes(question.axis)) {
    throw validationProblem('존재하지 않는 축이 포함되어 있습니다.');
  }
  if (!question.choices.A || !question.choices.B) {
    throw validationProblem('모든 선택지는 A/B를 가져야 합니다.');
  }

  for (const choice of ['A', 'B'] as const) {
    for (const value of Object.values(question.scoreEffect[choice] ?? {})) {
      if (value !== 20) throw validationProblem('점수는 20점만 허용합니다.');
    }
  }

  if (question.phase === 1) {
    if (question.branchCondition !== 'COMMON') throw validationProblem('Phase 1 branchCondition 오류입니다.');
    if (question.commonOrder !== 1 && question.commonOrder !== 2) {
      throw validationProblem('Phase 1 commonOrder 오류입니다.');
    }
    if (question.branchOrder !== undefined) throw validationProblem('Phase 1에는 branchOrder가 없어야 합니다.');
    if (question.intensityEffect.A !== 'neutral' || question.intensityEffect.B !== 'neutral') {
      throw validationProblem('Phase 1 intensityEffect 오류입니다.');
    }
  }

  if (question.phase === 2) {
    if (question.commonOrder !== undefined) throw validationProblem('Phase 2에는 commonOrder가 없어야 합니다.');
    if (![1, 2, 3].includes(question.branchOrder ?? 0)) {
      throw validationProblem('Phase 2 branchOrder 오류입니다.');
    }
    if (!branchConditionsForAxis(question.axis).includes(question.branchCondition)) {
      throw validationProblem('Phase 2 branchCondition 오류입니다.');
    }

    if (question.branchCondition === 'BALANCED') {
      if (question.intensityEffect.A !== 'neutral' || question.intensityEffect.B !== 'neutral') {
        throw validationProblem('BALANCED intensityEffect 오류입니다.');
      }
      return;
    }

    const intensityValues = [question.intensityEffect.A, question.intensityEffect.B].toSorted();
    if (intensityValues.join(',') !== 'concession,principle') {
      throw validationProblem('Phase 2 단방향 분기 intensityEffect 오류입니다.');
    }
  }
}

export function validateQuestionPool(): void {
  if (questions.length !== 44) throw validationProblem('MVP 알고리즘 슬롯은 44개여야 합니다.');

  const ids = new Set<string>();
  for (const question of questions) {
    if (ids.has(question.id)) throw validationProblem('문항 ID가 중복되었습니다.');
    ids.add(question.id);
    validateQuestion(question);
  }

  for (const axis of AXIS_ORDER) {
    for (const commonOrder of [1, 2] as const) {
      const count = questions.filter(
        (question) =>
          question.axis === axis &&
          question.phase === 1 &&
          question.branchCondition === 'COMMON' &&
          question.commonOrder === commonOrder
      ).length;
      if (count !== 1) throw validationProblem('Phase 1 슬롯이 누락되었습니다.');
    }

    for (const branchCondition of branchConditionsForAxis(axis)) {
      for (const branchOrder of [1, 2, 3] as const) {
        const count = questions.filter(
          (question) =>
            question.axis === axis &&
            question.phase === 2 &&
            question.branchCondition === branchCondition &&
            question.branchOrder === branchOrder
        ).length;
        if (count !== 1) throw validationProblem('Phase 2 슬롯이 누락되었습니다.');
      }
    }
  }
}

validateQuestionPool();
