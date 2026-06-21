import { browser } from '$app/environment';
import type { AnswerHistoryItem, PublicResult } from '$lib/shared/types';

const HISTORY_KEY = 'poldigm.history';
const STARTED_AT_KEY = 'poldigm.startedAt';
const LAST_RESULT_KEY = 'poldigm.lastResult';

export function resetSession(): void {
  if (!browser) return;
  sessionStorage.removeItem(HISTORY_KEY);
  sessionStorage.removeItem(LAST_RESULT_KEY);
  sessionStorage.setItem(STARTED_AT_KEY, String(Date.now()));
}

export function getHistory(): AnswerHistoryItem[] {
  if (!browser) return [];
  const raw = sessionStorage.getItem(HISTORY_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as AnswerHistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
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
    const parsed = JSON.parse(raw) as PublicResult;
    return parsed?.resultId ? parsed : null;
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
