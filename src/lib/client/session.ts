import { browser } from '$app/environment';
import { AXIS_ORDER, AXIS_SIDES, LETTER_LABELS } from '$lib/shared/constants';
import { buildAxisGaugeView } from '$lib/shared/result-display';
import type { AnswerHistoryItem, Letter, PublicResult } from '$lib/shared/types';

const HISTORY_KEY = 'poldigm.history';
const STARTED_AT_KEY = 'poldigm.startedAt';
const LAST_RESULT_KEY = 'poldigm.lastResult';
const NICKNAME_KEY = 'poldigm.nickname';
const QUESTION_SEED_KEY = 'poldigm.questionSeed';
const SCORE_LETTERS = Object.keys(LETTER_LABELS) as Letter[];

function createQuestionSeed(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

export function isAnswerHistoryItem(value: unknown): value is AnswerHistoryItem {
  if (!isRecord(value)) return false;
  if (!isString(value.questionId)) return false;
  if (value.choice !== 'A' && value.choice !== 'B') return false;
  return value.answeredAt === undefined || typeof value.answeredAt === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isScoreValue(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value) && value >= 0 && value <= 100;
}

function isLetter(value: unknown): value is Letter {
  return typeof value === 'string' && value in LETTER_LABELS;
}

function isTypeCode(value: unknown): value is string {
  return typeof value === 'string' && /^[CI][TP][ME][OL]$/.test(value);
}

function hasValidScores(value: Record<string, unknown>): boolean {
  const keys = Object.keys(value);

  return (
    keys.length === SCORE_LETTERS.length &&
    keys.every((key) => key in LETTER_LABELS) &&
    SCORE_LETTERS.every((letter) => isScoreValue(value[letter]))
  );
}

function hasValidAxisGauges(value: unknown, scores: PublicResult['scores']): boolean {
  if (!Array.isArray(value) || value.length !== 4) return false;

  return value.every((gauge, index) => {
    if (!isRecord(gauge)) return false;
    const [expectedLeft, expectedRight] = AXIS_SIDES[AXIS_ORDER[index]];
    const expectedGauge = buildAxisGaugeView({
      left: expectedLeft,
      right: expectedRight,
      scores
    });

    return (
      isLetter(gauge.left) &&
      isLetter(gauge.right) &&
      isLetter(gauge.winner) &&
      gauge.left === expectedGauge.left &&
      gauge.right === expectedGauge.right &&
      gauge.leftPercent === expectedGauge.leftPercent &&
      gauge.winner === expectedGauge.winner &&
      gauge.winnerPercent === expectedGauge.winnerPercent &&
      gauge.directionLabel === expectedGauge.directionLabel &&
      gauge.strengthLabel === expectedGauge.strengthLabel
    );
  });
}

export function isPublicResult(value: unknown): value is PublicResult {
  if (!isRecord(value)) return false;
  if (!isString(value.resultId) || !isString(value.resultCode) || value.locale !== 'ko-KR') return false;
  if (!isRecord(value.scores) || !isRecord(value.resultViewModel)) return false;
  if (!hasValidScores(value.scores)) return false;

  const scores = value.scores as PublicResult['scores'];
  const viewModel = value.resultViewModel;
  if (!isTypeCode(viewModel.typeCode) || (viewModel.intensityTag !== 'S' && viewModel.intensityTag !== 'M')) {
    return false;
  }
  if (value.resultCode !== `${viewModel.typeCode}-${viewModel.intensityTag}`) return false;

  return (
    isString(viewModel.title) &&
    isString(viewModel.subtitle) &&
    viewModel.characterImg === `character_${viewModel.typeCode}.png` &&
    isString(viewModel.description) &&
    hasValidAxisGauges(viewModel.axisGauges, scores) &&
    isTypeCode(viewModel.chemistryBest) &&
    isTypeCode(viewModel.chemistryWorst)
  );
}

export function resetSession(): void {
  if (!browser) return;
  sessionStorage.removeItem(HISTORY_KEY);
  sessionStorage.removeItem(LAST_RESULT_KEY);
  sessionStorage.setItem(QUESTION_SEED_KEY, createQuestionSeed());
  sessionStorage.setItem(STARTED_AT_KEY, String(Date.now()));
}

export function normalizeNickname(value: string): string {
  return value.trim().replace(/\s+/g, ' ').slice(0, 16);
}

export function saveNickname(value: string): string {
  if (!browser) return '';
  const nickname = normalizeNickname(value);

  if (nickname) {
    sessionStorage.setItem(NICKNAME_KEY, nickname);
  } else {
    sessionStorage.removeItem(NICKNAME_KEY);
  }

  return nickname;
}

export function getNickname(): string {
  if (!browser) return '';
  return sessionStorage.getItem(NICKNAME_KEY) ?? '';
}

export function getHistory(): AnswerHistoryItem[] {
  if (!browser) return [];
  const raw = sessionStorage.getItem(HISTORY_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) && parsed.every(isAnswerHistoryItem) ? parsed : [];
  } catch {
    return [];
  }
}

export function getQuestionSeed(): string {
  if (!browser) return '';
  const existing = sessionStorage.getItem(QUESTION_SEED_KEY);
  if (existing) return existing;

  const seed = createQuestionSeed();
  sessionStorage.setItem(QUESTION_SEED_KEY, seed);
  return seed;
}

export function saveHistory(history: AnswerHistoryItem[]): void {
  if (!browser) return;
  sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function appendAnswer(answer: AnswerHistoryItem): AnswerHistoryItem[] {
  const history = [...getHistory(), answer];
  saveHistory(history);
  return history;
}

export function getPlayTimeSec(): number {
  if (!browser) return 0;
  const startedAt = Number(sessionStorage.getItem(STARTED_AT_KEY));
  if (!Number.isFinite(startedAt) || startedAt <= 0) return 0;
  return Math.floor((Date.now() - startedAt) / 1000);
}

export function saveLastResult(result: PublicResult): void {
  if (!browser) return;
  sessionStorage.setItem(LAST_RESULT_KEY, JSON.stringify(result));
}

export function getLastResult(): PublicResult | null {
  if (!browser) return null;
  const raw = sessionStorage.getItem(LAST_RESULT_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    return isPublicResult(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function deviceType(): 'Mobile' | 'Desktop' | 'Tablet' {
  if (!browser) return 'Desktop';
  const width = window.innerWidth;
  if (width < 768) return 'Mobile';
  if (width < 1024) return 'Tablet';
  return 'Desktop';
}
