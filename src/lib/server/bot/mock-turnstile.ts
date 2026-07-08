import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { isLocalApp } from '$lib/constants/runtime';
import { botProblem } from '$lib/server/algorithm/errors';

type TurnstileSiteverifyResponse = {
  success: boolean;
  'error-codes'?: string[];
};

type BotVerificationGrantPayload = {
  kind: 'bot_verification';
  verifiedAt: number;
  expiresAt: number;
  nonce: string;
};

const BOT_VERIFICATION_GRANT_TTL_MS = 2 * 60 * 60 * 1000;

export function canUseLocalMockTurnstile(options = { isDev: dev, isLocal: isLocalApp }): boolean {
  return options.isDev && options.isLocal;
}

function getTurnstileSecret(): string {
  const secret = env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    throw botProblem('봇 검증 설정이 누락되었습니다.');
  }
  return secret;
}

function base64UrlEncode(value: string): string {
  return btoa(value).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function base64UrlDecode(value: string): string {
  const padded = `${value}${'='.repeat((4 - (value.length % 4)) % 4)}`;
  return atob(padded.replaceAll('-', '+').replaceAll('_', '/'));
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
}

function timingSafeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;

  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
}

export async function verifyTurnstileToken(token: unknown, remoteIp?: string): Promise<void> {
  if (canUseLocalMockTurnstile() && token === 'local-mock-token') return;

  if (typeof token !== 'string' || token.trim() === '') {
    throw botProblem();
  }

  const secret = getTurnstileSecret();

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

export async function createBotVerificationGrant(): Promise<string> {
  if (canUseLocalMockTurnstile()) return 'local-mock-token';

  const now = Date.now();
  const payload: BotVerificationGrantPayload = {
    kind: 'bot_verification',
    verifiedAt: now,
    expiresAt: now + BOT_VERIFICATION_GRANT_TTL_MS,
    nonce: crypto.randomUUID()
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await sign(encodedPayload, getTurnstileSecret());
  return `${encodedPayload}.${signature}`;
}

export async function verifyBotVerificationGrant(grant: unknown): Promise<void> {
  if (canUseLocalMockTurnstile() && grant === 'local-mock-token') return;

  if (typeof grant !== 'string' || grant.trim() === '') {
    throw botProblem();
  }

  const [encodedPayload, signature, ...extra] = grant.split('.');
  if (!encodedPayload || !signature || extra.length > 0) {
    throw botProblem();
  }

  const expectedSignature = await sign(encodedPayload, getTurnstileSecret());
  if (!timingSafeEqual(signature, expectedSignature)) {
    throw botProblem();
  }

  let payload: BotVerificationGrantPayload;
  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload)) as BotVerificationGrantPayload;
  } catch {
    throw botProblem();
  }

  if (payload.kind !== 'bot_verification' || !Number.isFinite(payload.expiresAt) || payload.expiresAt < Date.now()) {
    throw botProblem();
  }
}
