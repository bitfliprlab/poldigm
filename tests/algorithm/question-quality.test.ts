import { describe, expect, it } from 'vitest';
import { AXIS_SIDES } from '../../src/lib/shared/constants';
import { allQuestions, questions } from '../../src/lib/server/data/questions.ko-KR';
import { resultMappings } from '../../src/lib/server/data/result-mappings.ko-KR';

const FORBIDDEN_COPY_PATTERNS = [
  /정당/,
  /후보/,
  /선거/,
  /투표/,
  /대통령/,
  /국회의원/,
  /좌파/,
  /우파/,
  /우월/,
  /열등/,
  /틀렸다/,
  /위험한 사람/
];

const REPETITIVE_TEST_COPY_PATTERNS = [/찬성한다/, /반대한다/, /상황입니다/];

const GENERIC_FALLBACK_COPY_PATTERNS = [
  /가까운 판단 기준/,
  /처음 세운 기준/,
  /원칙을 계속/,
  /반대쪽 요구/,
  /동시에 만족시키기 어렵다면/,
  /쪽을 먼저 보존/,
  /쪽을 먼저 두고, 생기는/,
  /쪽을 기준으로 삼고/
];

const MOJIBAKE_PATTERNS = [
  /�/,
  /[一-鿿]/,
  /\?[가-힣]*[꾩쒕먯덉뚮]/,
  /李|諛|怨|媛|踰|寃|臾|醫|援/
];

function assertCleanKoreanCopy(value: string): void {
  expect(value.trim()).toBe(value);
  expect(value.length).toBeGreaterThanOrEqual(8);
  expect(MOJIBAKE_PATTERNS.some((pattern) => pattern.test(value))).toBe(false);
  expect(FORBIDDEN_COPY_PATTERNS.some((pattern) => pattern.test(value))).toBe(false);
}

function assertNonRepetitiveTestCopy(value: string): void {
  expect(REPETITIVE_TEST_COPY_PATTERNS.some((pattern) => pattern.test(value))).toBe(false);
}

function assertNoGenericFallbackCopy(value: string): void {
  expect(GENERIC_FALLBACK_COPY_PATTERNS.some((pattern) => pattern.test(value))).toBe(false);
}

function assertDisplayHighlights(value: string, highlights: string[]): void {
  expect(highlights.length).toBeGreaterThan(0);
  for (const highlight of highlights) {
    expect(highlight.trim()).toBe(highlight);
    expect(highlight.length).toBeGreaterThanOrEqual(2);
    expect(value).toContain(highlight);
  }
}

describe('question and result copy quality gates', () => {
  it('keeps every question and choice readable, non-broken, and value-dilemma based', () => {
    for (const question of questions) {
      assertCleanKoreanCopy(question.prompt);
      assertCleanKoreanCopy(question.choices.A);
      assertCleanKoreanCopy(question.choices.B);
      assertNonRepetitiveTestCopy(question.prompt);
      assertNonRepetitiveTestCopy(question.choices.A);
      assertNonRepetitiveTestCopy(question.choices.B);
      assertNoGenericFallbackCopy(question.prompt);
      assertNoGenericFallbackCopy(question.choices.A);
      assertNoGenericFallbackCopy(question.choices.B);

      expect(question.prompt.length).toBeLessThanOrEqual(80);
      expect(question.choices.A.length).toBeLessThanOrEqual(90);
      expect(question.choices.B.length).toBeLessThanOrEqual(90);
      expect(/[.!?]$/.test(question.prompt)).toBe(true);
      expect(question.choices.A).not.toBe(question.choices.B);
    }
  });

  it('keeps every question display model complete and aligned with plain copy', () => {
    for (const question of allQuestions) {
      expect(question.metadata.scenarioTag).toMatch(/^[a-z0-9_-]+$/);
      expect(question.metadata.copyFamily).toMatch(/^(base-copy|variant-v[23])$/);
      expect(['daily', 'institutional', 'crisis']).toContain(question.metadata.toneTag);

      expect(question.display.promptLines).toHaveLength(2);
      expect(question.display.promptLines.join(' ')).toContain(question.prompt.slice(0, 10));
      assertDisplayHighlights(question.display.promptLines.join(' '), question.display.promptHighlights);

      for (const choice of ['A', 'B'] as const) {
        const display = question.display.choices[choice];

        expect(display.body).toBe(question.choices[choice]);
        expect(display.label.length).toBeGreaterThanOrEqual(4);
        expect(display.label.length).toBeLessThanOrEqual(16);
        assertCleanKoreanCopy(display.body);
        assertNonRepetitiveTestCopy(display.label);
        assertNonRepetitiveTestCopy(display.body);
        assertDisplayHighlights(`${display.label} ${display.body}`, display.highlights);
      }
    }
  });

  it('keeps scoring direction consistent with the axis contract', () => {
    for (const question of allQuestions) {
      const [left, right] = AXIS_SIDES[question.axis];

      if (question.phase === 1 || question.branchCondition === 'BALANCED') {
        expect(question.scoreEffect.A).toEqual({ [left]: 20 });
        expect(question.scoreEffect.B).toEqual({ [right]: 20 });
        continue;
      }

      expect(question.scoreEffect.A).toEqual({ [question.branchCondition]: 20 });
      expect(question.scoreEffect.B).toEqual({});
      expect(question.intensityEffect.A).toBe('principle');
      expect(question.intensityEffect.B).toBe('concession');
    }
  });

  it('keeps all result mappings readable and complete', () => {
    for (const mapping of resultMappings) {
      assertCleanKoreanCopy(mapping.title);
      assertCleanKoreanCopy(mapping.subtitle);
      assertCleanKoreanCopy(mapping.desc_S);
      assertCleanKoreanCopy(mapping.desc_M);

      expect(mapping.title.length).toBeLessThanOrEqual(24);
      expect(mapping.subtitle.length).toBeLessThanOrEqual(48);
      expect(mapping.desc_S.length).toBeGreaterThanOrEqual(80);
      expect(mapping.desc_M.length).toBeGreaterThanOrEqual(70);
      expect(mapping.character_img).toBe(`character_${mapping.type_code}.png`);
    }
  });
});
