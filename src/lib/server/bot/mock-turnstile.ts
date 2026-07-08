import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { isLocalApp } from '$lib/constants/runtime';
import { botProblem } from '$lib/server/algorithm/errors';

type TurnstileSiteverifyResponse = {
  success: boolean;
  'error-codes'?: string[];
};

export function canUseLocalMockTurnstile(options = { isDev: dev, isLocal: isLocalApp }): boolean {
  return options.isDev && options.isLocal;
}

export async function verifyTurnstileToken(token: unknown, remoteIp?: string): Promise<void> {
  if (canUseLocalMockTurnstile() && token === 'local-mock-token') return;

  if (typeof token !== 'string' || token.trim() === '') {
    throw botProblem();
  }

  const secret = env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    throw botProblem('봇 검증 설정이 누락되었습니다.');
  }

  const body = new FormData();
  body.set('secret', secret);
  body.set('response', token);
  if (remoteIp) body.set('remoteip', remoteIp);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body
  });

  if (!response.ok) {
    throw botProblem();
  }

  const result = (await response.json()) as TurnstileSiteverifyResponse;
  if (!result.success) {
    throw botProblem();
  }
}
