import type { AnswerHistoryItem, DeviceType, PublicResult } from '$lib/shared/types';

export type LocalResultRecord = PublicResult & {
  createdAt: string;
  history: AnswerHistoryItem[];
  playTimeSec?: number;
  deviceType?: DeviceType;
  utmSource?: string;
};

const localResults = new Map<string, LocalResultRecord>();

export function createLocalResultId(): string {
  return crypto.randomUUID();
}

export function saveLocalResult(record: Omit<LocalResultRecord, 'createdAt'>): LocalResultRecord {
  const saved: LocalResultRecord = {
    ...record,
    createdAt: new Date().toISOString()
  };
  localResults.set(record.resultId, saved);
  return saved;
}

export function getLocalResult(id: string): PublicResult | null {
  const record = localResults.get(id);
  if (!record) return null;

  return {
    resultId: record.resultId,
    resultCode: record.resultCode,
    locale: record.locale,
    scores: record.scores,
    resultViewModel: record.resultViewModel
  };
}

export function clearLocalResults(): void {
  localResults.clear();
}
