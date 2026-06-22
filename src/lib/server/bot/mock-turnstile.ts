import { dev } from '$app/environment';
import { isLocalApp } from '$lib/constants/runtime';
import { botProblem } from '$lib/server/algorithm/errors';

export function canUseLocalMockTurnstile(options = { isDev: dev, isLocal: isLocalApp }): boolean {
  return options.isDev && options.isLocal;
}

export function verifyTurnstileToken(token: unknown): void {
  if (canUseLocalMockTurnstile() && token === 'local-mock-token') return;
  throw botProblem();
}
