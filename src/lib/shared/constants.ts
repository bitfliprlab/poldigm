import type { Axis, Letter } from './types';

export const AXIS_ORDER: Axis[] = ['C_I', 'T_P', 'M_E', 'O_L'];

export const AXIS_SIDES: Record<Axis, readonly [Letter, Letter]> = {
  C_I: ['C', 'I'],
  T_P: ['T', 'P'],
  M_E: ['M', 'E'],
  O_L: ['O', 'L']
};

export const LETTER_LABELS: Record<Letter, string> = {
  C: '공동체',
  I: '개인',
  T: '전통',
  P: '진보',
  M: '성과',
  E: '평등',
  O: '질서',
  L: '자유'
};

export const TOTAL_QUESTION_COUNT = 20;
