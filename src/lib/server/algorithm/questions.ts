import { AXIS_ORDER, AXIS_SIDES, TOTAL_QUESTION_COUNT } from '$lib/shared/constants';
import type {
  AnswerHistoryItem,
  Axis,
  BranchCondition,
  PublicQuestion
} from '$lib/shared/types';
import { questions, questionsById } from '$lib/server/data/questions.ko-KR';
import type { QuestionDefinition } from '$lib/server/data/types';
import { computeScoresForHistory } from './scoring';
import { validateReachableHistory } from './validation';
import { validationProblem } from './errors';

export function toPublicQuestion(question: QuestionDefinition, current: number): PublicQuestion {
  return {
    id: question.id,
    phase: question.phase,
    axis: question.axis,
    prompt: question.prompt,
    choices: question.choices,
    progress: {
      current,
      total: TOTAL_QUESTION_COUNT,
      label: question.phase === 1 ? 'Phase 1 탐색기' : 'Phase 2 심층기'
    }
  };
}

export function getQuestionById(id: string): QuestionDefinition {
  const question = questionsById.get(id);
  if (!question) throw validationProblem('존재하지 않는 문항 ID입니다.');
  return question;
}

export function getQuestionBySlot(params: {
  phase: 1 | 2;
  axis: Axis;
  branchCondition: BranchCondition;
  commonOrder?: 1 | 2;
  branchOrder?: 1 | 2 | 3;
}): QuestionDefinition {
  const question = questions.find((candidate) => {
    if (candidate.phase !== params.phase) return false;
    if (candidate.axis !== params.axis) return false;
    if (candidate.branchCondition !== params.branchCondition) return false;
    if (params.phase === 1) return candidate.commonOrder === params.commonOrder;
    return candidate.branchOrder === params.branchOrder;
  });

  if (!question) throw validationProblem('다음 문항 슬롯을 찾을 수 없습니다.');
  return question;
}

export function historyForAxis(history: AnswerHistoryItem[], axis: Axis): AnswerHistoryItem[] {
  return history.filter((answer) => getQuestionById(answer.questionId).axis === axis);
}

export function branchForAxis(
  axis: Axis,
  phase1History: AnswerHistoryItem[]
): Exclude<BranchCondition, 'COMMON'> {
  const [left, right] = AXIS_SIDES[axis];
  const axisScores = computeScoresForHistory(historyForAxis(phase1History, axis));

  if (axisScores[left] === axisScores[right]) return 'BALANCED';
  return axisScores[left] > axisScores[right] ? left : right;
}

export function expectedQuestionAtIndex(historyBeforeQuestion: AnswerHistoryItem[]): QuestionDefinition {
  const nextIndex = historyBeforeQuestion.length + 1;
  if (nextIndex > TOTAL_QUESTION_COUNT) {
    throw validationProblem('이미 완료된 응답 이력입니다.');
  }

  if (nextIndex <= 8) {
    const axis = AXIS_ORDER[(nextIndex - 1) % AXIS_ORDER.length];
    const commonOrder = nextIndex <= 4 ? 1 : 2;
    return getQuestionBySlot({
      phase: 1,
      axis,
      branchCondition: 'COMMON',
      commonOrder
    });
  }

  const phase2Index = nextIndex - 9;
  const axis = AXIS_ORDER[phase2Index % AXIS_ORDER.length];
  const branchOrder = (Math.floor(phase2Index / AXIS_ORDER.length) + 1) as 1 | 2 | 3;
  const branchCondition = branchForAxis(axis, historyBeforeQuestion.slice(0, 8));

  return getQuestionBySlot({
    phase: 2,
    axis,
    branchCondition,
    branchOrder
  });
}

export function nextQuestion(history: AnswerHistoryItem[]):
  | { status: 'in_progress'; question: PublicQuestion }
  | { status: 'completed'; nextAction: 'submit_result' } {
  validateReachableHistory(history, { allowComplete: true });

  if (history.length >= TOTAL_QUESTION_COUNT) {
    return { status: 'completed', nextAction: 'submit_result' };
  }

  const question = expectedQuestionAtIndex(history);
  return {
    status: 'in_progress',
    question: toPublicQuestion(question, history.length + 1)
  };
}
