import { describe, expect, it } from 'vitest';
import {
  buildAxisGaugeView,
  softenAxisPercent,
  strengthForDisplayPercent
} from '../../src/lib/shared/result-display';

const MOJIBAKE_PATTERNS = [/�/, /[一-鿿]/, /李|諛|怨|媛|踰|寃|臾|醫|援|履/];

describe('result display helpers', () => {
  it('softens extreme raw scores instead of exposing 100/0 as-is', () => {
    expect(softenAxisPercent(100)).toBe(88);
    expect(softenAxisPercent(0)).toBe(12);
    expect(softenAxisPercent(50)).toBe(50);
  });

  it('labels display strength from softened percent bands', () => {
    expect(strengthForDisplayPercent(88)).toBe('강하게 기울어짐');
    expect(strengthForDisplayPercent(74)).toBe('기울어짐');
    expect(strengthForDisplayPercent(58)).toBe('균형에 가까움');
  });

  it('keeps result gauge labels free of mojibake', () => {
    const labels = [
      strengthForDisplayPercent(88),
      strengthForDisplayPercent(74),
      strengthForDisplayPercent(58),
      buildAxisGaugeView({
        left: 'C',
        right: 'I',
        scores: { C: 100, I: 0, T: 0, P: 0, M: 0, E: 0, O: 0, L: 0 }
      }).directionLabel
    ];

    for (const label of labels) {
      expect(MOJIBAKE_PATTERNS.some((pattern) => pattern.test(label))).toBe(false);
    }
  });

  it('builds a left-winning gauge view from raw scores', () => {
    const view = buildAxisGaugeView({
      left: 'C',
      right: 'I',
      scores: { C: 100, I: 0, T: 0, P: 0, M: 0, E: 0, O: 0, L: 0 }
    });

    expect(view).toMatchObject({
      leftPercent: 88,
      left: 'C',
      right: 'I',
      winner: 'C',
      winnerPercent: 88,
      directionLabel: 'C 공동체 쪽',
      strengthLabel: '강하게 기울어짐'
    });
  });

  it('builds a right-winning gauge view from raw scores', () => {
    const view = buildAxisGaugeView({
      left: 'C',
      right: 'I',
      scores: { C: 20, I: 80, T: 0, P: 0, M: 0, E: 0, O: 0, L: 0 }
    });

    expect(view.leftPercent).toBe(27);
    expect(view.winner).toBe('I');
    expect(view.winnerPercent).toBe(73);
    expect(view.directionLabel).toBe('I 개인 쪽');
    expect(view.strengthLabel).toBe('기울어짐');
  });
});
