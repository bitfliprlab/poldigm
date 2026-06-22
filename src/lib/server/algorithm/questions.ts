import { AXIS_ORDER, AXIS_SIDES, TOTAL_QUESTION_COUNT } from '$lib/shared/constants';
import type {
  AnswerHistoryItem,
  Axis,
  BranchCondition,
  PublicQuestion
} from '$lib/shared/types';
import { questions, questionsById, questionsBySlotId } from '$lib/server/data/questions.ko-KR';
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
    display: question.display,
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

export function slotIdForQuestion(question: QuestionDefinition): string {
  return question.slotId ?? question.id;
}

function stableIndex(seed: string, slotId: string, current: number, length: number): number {
  if (length <= 1 || !seed) return 0;

  const input = `${seed}:${slotId}:${current}`;
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return Math.abs(hash) % length;
}

function metadataUsage(history: AnswerHistoryItem[]): {
  scenarioTags: Map<string, number>;
  copyFamilies: Map<string, number>;
  toneTags: Map<QuestionDefinition['metadata']['toneTag'], number>;
} {
  const scenarioTags = new Map<string, number>();
  const copyFamilies = new Map<string, number>();
  const toneTags = new Map<QuestionDefinition['metadata']['toneTag'], number>();

  for (const answer of history) {
    const metadata = getQuestionById(answer.questionId).metadata;
    scenarioTags.set(metadata.scenarioTag, (scenarioTags.get(metadata.scenarioTag) ?? 0) + 1);
    copyFamilies.set(metadata.copyFamily, (copyFamilies.get(metadata.copyFamily) ?? 0) + 1);
    toneTags.set(metadata.toneTag, (toneTags.get(metadata.toneTag) ?? 0) + 1);
  }

  return { scenarioTags, copyFamilies, toneTags };
}

function recentMetadataUsage(history: AnswerHistoryItem[], windowSize = 3): {
  scenarioTags: Map<string, number>;
  toneTags: Map<QuestionDefinition['metadata']['toneTag'], number>;
} {
  const recentHistory = history.slice(-windowSize);
  const scenarioTags = new Map<string, number>();
  const toneTags = new Map<QuestionDefinition['metadata']['toneTag'], number>();

  for (const answer of recentHistory) {
    const metadata = getQuestionById(answer.questionId).metadata;
    scenarioTags.set(metadata.scenarioTag, (scenarioTags.get(metadata.scenarioTag) ?? 0) + 1);
    toneTags.set(metadata.toneTag, (toneTags.get(metadata.toneTag) ?? 0) + 1);
  }

  return { scenarioTags, toneTags };
}

function selectQuestionVariant(
  base: QuestionDefinition,
  seed: string | undefined,
  current: number,
  historyBeforeQuestion: AnswerHistoryItem[]
): QuestionDefinition {
  const slotId = slotIdForQuestion(base);
  const candidates = questionsBySlotId.get(slotId) ?? [base];
  const offset = stableIndex(seed ?? '', slotId, current, candidates.length);

  if (candidates.length <= 1 || !seed || historyBeforeQuestion.length === 0) {
    return candidates[offset] ?? base;
  }

  const usage = metadataUsage(historyBeforeQuestion);
  const recentUsage = recentMetadataUsage(historyBeforeQuestion);
  const ranked = candidates
    .map((candidate, index) => {
      const metadata = candidate.metadata;
      return {
        candidate,
        seededOrder: (index - offset + candidates.length) % candidates.length,
        recentScenarioCount: recentUsage.scenarioTags.get(metadata.scenarioTag) ?? 0,
        recentToneCount: recentUsage.toneTags.get(metadata.toneTag) ?? 0,
        scenarioCount: usage.scenarioTags.get(metadata.scenarioTag) ?? 0,
        copyFamilyCount: usage.copyFamilies.get(metadata.copyFamily) ?? 0,
        toneCount: usage.toneTags.get(metadata.toneTag) ?? 0
      };
    })
    .toSorted((a, b) =>
      a.copyFamilyCount - b.copyFamilyCount ||
      a.recentScenarioCount - b.recentScenarioCount ||
      a.recentToneCount - b.recentToneCount ||
      a.scenarioCount - b.scenarioCount ||
      a.toneCount - b.toneCount ||
      a.seededOrder - b.seededOrder
    );

  return ranked[0]?.candidate ?? base;
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

export function expectedQuestionAtIndex(
  historyBeforeQuestion: AnswerHistoryItem[],
  questionSeed?: string
): QuestionDefinition {
  const nextIndex = historyBeforeQuestion.length + 1;
  if (nextIndex > TOTAL_QUESTION_COUNT) {
    throw validationProblem('이미 완료된 응답 이력입니다.');
  }

  if (nextIndex <= 8) {
    const axis = AXIS_ORDER[(nextIndex - 1) % AXIS_ORDER.length];
    const commonOrder = nextIndex <= 4 ? 1 : 2;
    return selectQuestionVariant(getQuestionBySlot({
      phase: 1,
      axis,
      branchCondition: 'COMMON',
      commonOrder
    }), questionSeed, nextIndex, historyBeforeQuestion);
  }

  const phase2Index = nextIndex - 9;
  const axis = AXIS_ORDER[phase2Index % AXIS_ORDER.length];
  const branchOrder = (Math.floor(phase2Index / AXIS_ORDER.length) + 1) as 1 | 2 | 3;
  const branchCondition = branchForAxis(axis, historyBeforeQuestion.slice(0, 8));

  return selectQuestionVariant(getQuestionBySlot({
    phase: 2,
    axis,
    branchCondition,
    branchOrder
  }), questionSeed, nextIndex, historyBeforeQuestion);
}

export function nextQuestion(history: AnswerHistoryItem[], questionSeed?: string):
  | { status: 'in_progress'; question: PublicQuestion }
  | { status: 'completed'; nextAction: 'submit_result' } {
  validateReachableHistory(history, { allowComplete: true });

  if (history.length >= TOTAL_QUESTION_COUNT) {
    return { status: 'completed', nextAction: 'submit_result' };
  }

  const question = expectedQuestionAtIndex(history, questionSeed);
  return {
    status: 'in_progress',
    question: toPublicQuestion(question, history.length + 1)
  };
}
