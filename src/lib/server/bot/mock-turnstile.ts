import { isLocalApp } from '$lib/constants/runtime';
import { botProblem } from '$lib/server/algorithm/errors';

export function verifyTurnstileToken(token: unknown): void {
  if (isLocalApp && token === 'local-mock-token') return;
  throw botProblem();
}
