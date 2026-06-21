import type { ApiErrorCode } from '$lib/shared/types';

export class ApiProblem extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ApiErrorCode,
    message: string
  ) {
    super(message);
  }
}

export function validationProblem(message = 'history 형식이 올바르지 않습니다.') {
  return new ApiProblem(400, 'validation_error', message);
}

export function abuseProblem(message = '비정상적으로 빠르게 진행된 테스트입니다.') {
  return new ApiProblem(429, 'abuse_suspected', message);
}

export function botProblem(message = '봇 검증에 실패했습니다.') {
  return new ApiProblem(403, 'bot_verification_failed', message);
}
