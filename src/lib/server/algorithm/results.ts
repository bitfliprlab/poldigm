import type { AnswerHistoryItem, DeviceType, PublicResult, ResultViewModel } from '$lib/shared/types';
import { resultMappingsByCode } from '$lib/server/data/result-mappings.ko-KR';
import { computeResultCode } from './scoring';
import { validationProblem } from './errors';

export function buildResultViewModel(
  typeCode: string,
  intensityTag: 'S' | 'M'
): ResultViewModel {
  const mapping = resultMappingsByCode.get(typeCode);
  if (!mapping) throw validationProblem('결과 매핑을 찾을 수 없습니다.');

  return {
    typeCode,
    intensityTag,
    title: mapping.title,
    subtitle: mapping.subtitle,
    characterImg: mapping.character_img,
    description: intensityTag === 'S' ? mapping.desc_S : mapping.desc_M,
    chemistryBest: mapping.chemistry_best,
    chemistryWorst: mapping.chemistry_worst
  };
}

export function buildPublicResult(params: {
  resultId: string;
  history: AnswerHistoryItem[];
}): PublicResult {
  const { typeCode, intensityTag, resultCode, scores } = computeResultCode(params.history);

  return {
    resultId: params.resultId,
    resultCode,
    locale: 'ko-KR',
    scores,
    resultViewModel: buildResultViewModel(typeCode, intensityTag)
  };
}

export type SubmitResultMeta = {
  playTimeSec?: number;
  deviceType?: DeviceType;
  utmSource?: string;
};
