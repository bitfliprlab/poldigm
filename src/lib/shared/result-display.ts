import { LETTER_LABELS } from './constants';
import type { Letter, ResultAxisGauge, Scores } from './types';

export type AxisGaugeView = ResultAxisGauge;

export function softenAxisPercent(percent: number): number {
  if (percent === 50) return 50;
  return Math.min(88, Math.max(12, Math.round(50 + (percent - 50) * 0.76)));
}

export function strengthForDisplayPercent(
  percent: number
): AxisGaugeView['strengthLabel'] {
  if (percent >= 78) return '강하게 기울어짐';
  if (percent >= 62) return '기울어짐';
  return '균형에 가까움';
}

export function buildAxisGaugeView(params: {
  left: Letter;
  right: Letter;
  scores: Scores;
}): AxisGaugeView {
  const leftScore = params.scores[params.left];
  const rightScore = params.scores[params.right];
  const total = Math.max(1, leftScore + rightScore);
  const rawLeftPercent = Math.round((leftScore / total) * 100);
  const leftPercent = softenAxisPercent(rawLeftPercent);
  const winner = leftPercent >= 50 ? params.left : params.right;
  const winnerPercent = winner === params.left ? leftPercent : 100 - leftPercent;

  return {
    left: params.left,
    right: params.right,
    leftPercent,
    winner,
    winnerPercent,
    directionLabel: `${winner} ${LETTER_LABELS[winner]} 쪽`,
    strengthLabel: strengthForDisplayPercent(winnerPercent)
  };
}
