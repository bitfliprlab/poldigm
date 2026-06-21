import { describe, expect, it } from 'vitest';
import { computeResultCode } from '../../src/lib/server/algorithm/scoring';
import { allLeftModerateHistory, allLeftStrongHistory, balancedCiHistory } from '../helpers/fixtures';

describe('result scoring', () => {
  it('computes a strong result when all winning axes keep principle choices', () => {
    const result = computeResultCode(allLeftStrongHistory());

    expect(result.resultCode).toBe('CTMO-S');
    expect(result.scores.C).toBe(100);
    expect(result.scores.T).toBe(100);
    expect(result.scores.M).toBe(100);
    expect(result.scores.O).toBe(100);
  });

  it('computes a moderate result when phase 2 concessions dominate', () => {
    const result = computeResultCode(allLeftModerateHistory());

    expect(result.resultCode).toBe('CTMO-M');
    expect(result.scores.C).toBe(40);
    expect(result.scores.T).toBe(40);
    expect(result.scores.M).toBe(40);
    expect(result.scores.O).toBe(40);
  });

  it('uses balanced branch scores for final letters but not intensity', () => {
    const result = computeResultCode(balancedCiHistory());

    expect(result.typeCode.startsWith('C')).toBe(true);
    expect(result.intensityTag).toBe('S');
  });
});
