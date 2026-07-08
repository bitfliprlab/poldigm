import { json, type RequestHandler } from '@sveltejs/kit';
import { ApiProblem } from '$lib/server/algorithm/errors';
import { readJsonObject } from '$lib/server/api/request';
import { createBotVerificationGrant, verifyTurnstileToken } from '$lib/server/bot/mock-turnstile';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await readJsonObject(request);

    await verifyTurnstileToken(body.turnstileToken, request.headers.get('CF-Connecting-IP') ?? undefined);
    return json({ botVerificationGrant: await createBotVerificationGrant() });
  } catch (error) {
    if (error instanceof ApiProblem) {
      return json({ error: { code: error.code, message: error.message } }, { status: error.status });
    }

    console.error(error);
    return json({ error: { code: 'server_error', message: '서버 내부 오류가 발생했습니다.' } }, { status: 500 });
  }
};
