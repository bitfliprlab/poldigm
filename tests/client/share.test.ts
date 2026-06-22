import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { PublicResult } from '../../src/lib/shared/types';
import { shareText } from '../../src/lib/client/share';
import { isAnswerHistoryItem, isPublicResult } from '../../src/lib/client/session';
import { buildAxisGaugeView } from '../../src/lib/shared/result-display';

const scores = { C: 80, I: 0, T: 80, P: 0, M: 80, E: 0, O: 80, L: 0 };

const result: PublicResult = {
  resultId: 'result-1',
  resultCode: 'CTMO-S',
  locale: 'ko-KR',
  scores,
  resultViewModel: {
    typeCode: 'CTMO',
    intensityTag: 'S',
    title: '공동체의 원칙 설계자',
    subtitle: '원칙과 질서를 중심으로 판단합니다.',
    characterImg: 'character_CTMO.png',
    description: '공개 결과 설명입니다.',
    axisGauges: [
      buildAxisGaugeView({ left: 'C', right: 'I', scores }),
      buildAxisGaugeView({ left: 'T', right: 'P', scores }),
      buildAxisGaugeView({ left: 'M', right: 'E', scores }),
      buildAxisGaugeView({ left: 'O', right: 'L', scores })
    ],
    chemistryBest: 'ITEL',
    chemistryWorst: 'IPEL'
  }
};

describe('capture import boundary', () => {
  it('does not statically import html2canvas for SSR', () => {
    const source = readFileSync('src/lib/client/share.ts', 'utf8');

    expect(source).toContain("await import('html2canvas')");
    expect(source).not.toContain("import html2canvas from 'html2canvas'");
  });

  it('personalizes share text without requiring server persistence', () => {
    expect(shareText(result)).toContain('나의 사회적·정치적 가치관은 [공동체의 원칙 설계자]');
    expect(shareText(result, '테스터')).toContain('테스터님의 사회적·정치적 가치관은 [공동체의 원칙 설계자]');
    expect(isPublicResult(result)).toBe(true);
    expect(isPublicResult({ resultId: 'broken-result' })).toBe(false);
    expect(isPublicResult({ ...result, resultCode: 'IPML-S' })).toBe(false);
    expect(isPublicResult({
      ...result,
      resultViewModel: { ...result.resultViewModel, intensityTag: 'M' }
    })).toBe(false);
    expect(isPublicResult({
      ...result,
      resultCode: 'XXXX-S',
      resultViewModel: { ...result.resultViewModel, typeCode: 'XXXX' }
    })).toBe(false);
    expect(isPublicResult({ ...result, resultViewModel: { title: result.resultViewModel.title } })).toBe(false);
    expect(isPublicResult({ ...result, scores: { C: 80 } })).toBe(false);
    expect(isPublicResult({
      ...result,
      scores: { ...scores, C: 40, I: 40 }
    })).toBe(false);
    expect(isPublicResult({
      ...result,
      scores: { ...scores, C: -20 }
    })).toBe(false);
    expect(isPublicResult({
      ...result,
      scores: { ...scores, C: 120 }
    })).toBe(false);
    expect(isPublicResult({
      ...result,
      scores: { ...scores, C: 80.5 }
    })).toBe(false);
    expect(isPublicResult({
      ...result,
      scores: { ...scores, X: 20 }
    })).toBe(false);
    expect(isPublicResult({
      ...result,
      resultViewModel: { ...result.resultViewModel, chemistryBest: '좋은궁합' }
    })).toBe(false);
    expect(isPublicResult({
      ...result,
      resultViewModel: { ...result.resultViewModel, chemistryWorst: 'XXXX' }
    })).toBe(false);
    expect(isPublicResult({
      ...result,
      resultViewModel: { ...result.resultViewModel, characterImg: 'character_IPEL.png' }
    })).toBe(false);
    expect(isPublicResult({
      ...result,
      resultViewModel: {
        ...result.resultViewModel,
        axisGauges: [{ left: 'C', right: 'I', winner: 'C' }]
      }
    })).toBe(false);
    expect(isPublicResult({
      ...result,
      resultViewModel: {
        ...result.resultViewModel,
        axisGauges: result.resultViewModel.axisGauges.map((gauge, index) =>
          index === 0 ? { ...gauge, winnerPercent: 101 } : gauge
        )
      }
    })).toBe(false);
    expect(isPublicResult({
      ...result,
      resultViewModel: {
        ...result.resultViewModel,
        axisGauges: result.resultViewModel.axisGauges.map((gauge, index) =>
          index === 0 ? { ...gauge, strengthLabel: '확정 판정' } : gauge
        )
      }
    })).toBe(false);
    expect(isPublicResult({
      ...result,
      resultViewModel: {
        ...result.resultViewModel,
        axisGauges: result.resultViewModel.axisGauges.map((gauge, index) =>
          index === 0 ? { ...gauge, strengthLabel: '기울어짐' } : gauge
        )
      }
    })).toBe(false);
    expect(isPublicResult({
      ...result,
      resultViewModel: {
        ...result.resultViewModel,
        axisGauges: result.resultViewModel.axisGauges.map((gauge, index) =>
          index === 0 ? { ...gauge, directionLabel: 'I 개인 쪽' } : gauge
        )
      }
    })).toBe(false);
    expect(isPublicResult({
      ...result,
      resultViewModel: {
        ...result.resultViewModel,
        axisGauges: result.resultViewModel.axisGauges.map((gauge, index) =>
          index === 0 ? { ...gauge, right: 'P' } : gauge
        )
      }
    })).toBe(false);
    expect(isPublicResult({
      ...result,
      resultViewModel: {
        ...result.resultViewModel,
        axisGauges: [
          result.resultViewModel.axisGauges[1],
          result.resultViewModel.axisGauges[0],
          result.resultViewModel.axisGauges[2],
          result.resultViewModel.axisGauges[3]
        ]
      }
    })).toBe(false);
    expect(isPublicResult({
      ...result,
      resultViewModel: {
        ...result.resultViewModel,
        axisGauges: result.resultViewModel.axisGauges.map((gauge, index) =>
          index === 0 ? { ...gauge, winner: 'I' } : gauge
        )
      }
    })).toBe(false);
    expect(isPublicResult({
      ...result,
      resultViewModel: {
        ...result.resultViewModel,
        axisGauges: result.resultViewModel.axisGauges.map((gauge, index) =>
          index === 0 ? { ...gauge, leftPercent: 88, winnerPercent: 87 } : gauge
        )
      }
    })).toBe(false);
    expect(isAnswerHistoryItem({ questionId: 'Q_1_C_I_1', choice: 'A' })).toBe(true);
    expect(isAnswerHistoryItem({ questionId: 'Q_1_C_I_1', choice: 'C' })).toBe(false);
    expect(isAnswerHistoryItem({ choice: 'A' })).toBe(false);
  });
});
