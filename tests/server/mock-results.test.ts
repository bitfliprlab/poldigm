import { describe, expect, it } from 'vitest';
import { buildPublicResult } from '../../src/lib/server/algorithm/results';
import {
  clearLocalResults,
  getLocalResult,
  saveLocalResult
} from '../../src/lib/server/storage/mock-results';
import { allLeftStrongHistory } from '../helpers/fixtures';

describe('local mock result storage', () => {
  it('stores local-only metadata while returning only public result data', () => {
    clearLocalResults();

    const history = allLeftStrongHistory();
    const publicResult = buildPublicResult({
      resultId: 'local-result-boundary',
      history
    });

    const saved = saveLocalResult({
      ...publicResult,
      history,
      playTimeSec: 42,
      deviceType: 'Desktop',
      utmSource: 'unit_test'
    });

    expect(saved).toMatchObject({
      resultId: publicResult.resultId,
      resultCode: 'CTMO-S',
      history,
      playTimeSec: 42,
      deviceType: 'Desktop',
      utmSource: 'unit_test'
    });
    expect(saved.createdAt).toEqual(expect.any(String));

    const publicLookup = getLocalResult(publicResult.resultId);
    expect(publicLookup).toEqual(publicResult);
    expect(publicLookup).not.toHaveProperty('history');
    expect(publicLookup).not.toHaveProperty('playTimeSec');
    expect(publicLookup).not.toHaveProperty('deviceType');
    expect(publicLookup).not.toHaveProperty('utmSource');
    expect(publicLookup).not.toHaveProperty('createdAt');
  });
});
