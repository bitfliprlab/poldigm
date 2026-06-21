import { describe, expect, it } from 'vitest';
import { AXIS_ORDER, AXIS_SIDES } from '../../src/lib/shared/constants';
import type { Letter } from '../../src/lib/shared/types';
import { computeResultCode } from '../../src/lib/server/algorithm/scoring';
import { buildResultViewModel } from '../../src/lib/server/algorithm/results';
import { validateReachableHistory } from '../../src/lib/server/algorithm/validation';
import { resultMappings } from '../../src/lib/server/data/result-mappings.ko-KR';
import { ALL_TYPE_CODES, buildHistoryForType } from '../helpers/fixtures';

describe('16-type result coverage', () => {
  it('has exactly one mapping for every base type code', () => {
    const mappedCodes = resultMappings.map((mapping) => mapping.type_code).sort();

    expect(mappedCodes).toEqual([...ALL_TYPE_CODES].sort());
    expect(new Set(mappedCodes)).toHaveProperty('size', 16);
  });

  it.each(ALL_TYPE_CODES)('reaches %s-S through the real 20-question flow', (typeCode) => {
    const history = buildHistoryForType(typeCode, 'S');
    validateReachableHistory(history, { allowComplete: true });

    const result = computeResultCode(history);
    const viewModel = buildResultViewModel(result.typeCode, result.intensityTag);

    expect(history).toHaveLength(20);
    expect(result.resultCode).toBe(`${typeCode}-S`);
    expect(viewModel.typeCode).toBe(typeCode);
    expect(viewModel.title.length).toBeGreaterThan(4);
    expect(viewModel.description.length).toBeGreaterThan(50);
  });

  it.each(ALL_TYPE_CODES)('reaches %s-M when phase 2 concessions dominate', (typeCode) => {
    const history = buildHistoryForType(typeCode, 'M');
    validateReachableHistory(history, { allowComplete: true });

    const result = computeResultCode(history);
    const viewModel = buildResultViewModel(result.typeCode, result.intensityTag);

    expect(history).toHaveLength(20);
    expect(result.resultCode).toBe(`${typeCode}-M`);
    expect(viewModel.typeCode).toBe(typeCode);
    expect(viewModel.description.length).toBeGreaterThan(50);
  });

  it('keeps each target letter dominant for generated type histories', () => {
    for (const typeCode of ALL_TYPE_CODES) {
      const result = computeResultCode(buildHistoryForType(typeCode, 'S'));

      AXIS_ORDER.forEach((axis, axisIndex) => {
        const [left, right] = AXIS_SIDES[axis];
        const target = typeCode[axisIndex] as Letter;
        const opposite = target === left ? right : left;

        expect(result.scores[target]).toBeGreaterThan(result.scores[opposite]);
      });
    }
  });
});
