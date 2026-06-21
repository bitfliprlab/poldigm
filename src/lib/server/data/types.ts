import type { Axis, BranchCondition, Choice, IntensityEffect, Letter } from '$lib/shared/types';

export type QuestionDefinition = {
  id: string;
  locale: 'ko-KR';
  axis: Axis;
  phase: 1 | 2;
  branchCondition: BranchCondition;
  commonOrder?: 1 | 2;
  branchOrder?: 1 | 2 | 3;
  prompt: string;
  choices: Record<Choice, string>;
  scoreEffect: Record<Choice, Partial<Record<Letter, number>>>;
  intensityEffect: Record<Choice, IntensityEffect>;
};

export type ResultMapping = {
  locale: 'ko-KR';
  type_code: string;
  title: string;
  subtitle: string;
  character_img: string;
  desc_S: string;
  desc_M: string;
  chemistry_best: string;
  chemistry_worst: string;
};
