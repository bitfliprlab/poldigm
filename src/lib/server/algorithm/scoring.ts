import { AXIS_ORDER, AXIS_SIDES } from '$lib/shared/constants';
import type { AnswerHistoryItem, Axis, Letter, Scores } from '$lib/shared/types';
import { questionsById } from '$lib/server/data/questions.ko-KR';
import { validationProblem } from './errors';

export function emptyScores(): Scores {
  return { C: 0, I: 0, T: 0, P: 0, M: 0, E: 0, O: 0, L: 0 };
}

export function computeScoresForHistory(history: AnswerHistoryItem[]): Scores {
  const scores = emptyScores();

  for (const answer of history) {
    const question = getQuestionById(answer.questionId);
    const effect = question.scoreEffect[answer.choice] ?? {};

    for (const [letter, value] of Object.entries(effect) as Array<[Letter, number]>) {
      scores[letter] += value;
    }
  }

  return scores;
}

function getQuestionById(id: string) {
  const question = questionsById.get(id);
  if (!question) throw validationProblem('알 수 없는 문항 ID입니다.');
  return question;
}

function historyForAxis(history: AnswerHistoryItem[], axis: Axis): AnswerHistoryItem[] {
  return history.filter((answer) => getQuestionById(answer.questionId).axis === axis);
}

function scoredLetterForAnswer(answer: AnswerHistoryItem, axis: Axis): Letter | null {
  const [left, right] = AXIS_SIDES[axis];
  const effect = getQuestionById(answer.questionId).scoreEffect[answer.choice] ?? {};
  if (effect[left]) return left;
  if (effect[right]) return right;
  return null;
}

export function winnerForAxis(
  axis: Axis,
  scores: Scores,
  history: AnswerHistoryItem[]
): Letter {
  const [left, right] = AXIS_SIDES[axis];

  if (scores[left] > scores[right]) return left;
  if (scores[right] > scores[left]) return right;

  const phase2AxisAnswers = historyForAxis(history, axis).filter(
    (answer) => getQuestionById(answer.questionId).phase === 2
  );

  for (const answer of phase2AxisAnswers.toReversed()) {
    const scoredLetter = scoredLetterForAnswer(answer, axis);
    if (scoredLetter) return scoredLetter;
  }

  const secondPhase1Answer = historyForAxis(history.slice(0, 8), axis).at(1);
  if (!secondPhase1Answer) throw validationProblem('동점 처리에 필요한 응답이 없습니다.');

  const fallbackLetter = scoredLetterForAnswer(secondPhase1Answer, axis);
  if (fallbackLetter) return fallbackLetter;

  throw validationProblem('동점 처리에 실패했습니다.');
}

export function computeIntensityTag(letters: Letter[], history: AnswerHistoryItem[]): 'S' | 'M' {
  let strongAxisCount = 0;

  for (const letter of letters) {
    const principleCount = history.filter((answer) => {
      const question = getQuestionById(answer.questionId);
      return (
        question.phase === 2 &&
        question.branchCondition === letter &&
        question.intensityEffect[answer.choice] === 'principle'
      );
    }).length;

    if (principleCount >= 2) strongAxisCount += 1;
  }

  return strongAxisCount >= 3 ? 'S' : 'M';
}

export function computeResultCode(history: AnswerHistoryItem[]): {
  typeCode: string;
  intensityTag: 'S' | 'M';
  resultCode: string;
  scores: Scores;
} {
  const scores = computeScoresForHistory(history);
  const letters = AXIS_ORDER.map((axis) => winnerForAxis(axis, scores, history));
  const typeCode = letters.join('');
  const intensityTag = computeIntensityTag(letters, history);

  return {
    typeCode,
    intensityTag,
    resultCode: `${typeCode}-${intensityTag}`,
    scores
  };
}
