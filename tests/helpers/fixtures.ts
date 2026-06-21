import { AXIS_ORDER, AXIS_SIDES } from '../../src/lib/shared/constants';
import type { AnswerHistoryItem, Axis, Choice, Letter } from '../../src/lib/shared/types';
import { nextQuestion } from '../../src/lib/server/algorithm/questions';

const TYPE_CODE_LETTER_INDEX: Record<Axis, number> = {
  C_I: 0,
  T_P: 1,
  M_E: 2,
  O_L: 3
};

export const ALL_TYPE_CODES = [
  'CTMO',
  'CTML',
  'CTEO',
  'CTEL',
  'CPMO',
  'CPML',
  'CPEO',
  'CPEL',
  'ITMO',
  'ITML',
  'ITEO',
  'ITEL',
  'IPMO',
  'IPML',
  'IPEO',
  'IPEL'
] as const;

export type TestTypeCode = (typeof ALL_TYPE_CODES)[number];

export function buildHistory(choose: (questionId: string, index: number) => Choice): AnswerHistoryItem[] {
  const history: AnswerHistoryItem[] = [];

  for (let index = 0; index < 20; index += 1) {
    const response = nextQuestion(history);
    if (response.status !== 'in_progress') {
      throw new Error('테스트 fixture 생성 중 문항이 조기 종료되었습니다.');
    }

    history.push({
      questionId: response.question.id,
      choice: choose(response.question.id, index)
    });
  }

  return history;
}

function targetLetterForAxis(typeCode: TestTypeCode, axis: Axis): Letter {
  return typeCode[TYPE_CODE_LETTER_INDEX[axis]] as Letter;
}

export function buildHistoryForType(
  typeCode: TestTypeCode,
  intensity: 'S' | 'M' = 'S'
): AnswerHistoryItem[] {
  const history: AnswerHistoryItem[] = [];

  for (let index = 0; index < 20; index += 1) {
    const response = nextQuestion(history);
    if (response.status !== 'in_progress') {
      throw new Error(`${typeCode} fixture 생성 중 문항이 조기 종료되었습니다.`);
    }

    const targetLetter = targetLetterForAxis(typeCode, response.question.axis);
    const [left] = AXIS_SIDES[response.question.axis];
    const choice: Choice =
      response.question.phase === 1 ? (targetLetter === left ? 'A' : 'B') : intensity === 'S' ? 'A' : 'B';

    history.push({
      questionId: response.question.id,
      choice
    });
  }

  return history;
}

export const allLeftStrongHistory = () => buildHistory(() => 'A');

export const allLeftModerateHistory = () =>
  buildHistory((_questionId, index) => (index < 8 ? 'A' : 'B'));

export const balancedCiHistory = () =>
  buildHistory((questionId) => {
    if (questionId === 'Q_1_C_I_1') return 'A';
    if (questionId === 'Q_1_C_I_2') return 'B';
    return 'A';
  });

export function expectedAxisSequence(history: AnswerHistoryItem[]): Axis[] {
  return history.map((_answer, index) => AXIS_ORDER[index % AXIS_ORDER.length]);
}
