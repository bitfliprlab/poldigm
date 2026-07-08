import { json, type RequestHandler } from '@sveltejs/kit';
import type { DeviceType } from '$lib/shared/types';
import { abuseProblem, ApiProblem, validationProblem } from '$lib/server/algorithm/errors';
import { readJsonObject } from '$lib/server/api/request';
import { buildPublicResult } from '$lib/server/algorithm/results';
import { parseHistory, validateReachableHistory } from '$lib/server/algorithm/validation';
import { verifyBotVerificationGrant } from '$lib/server/bot/mock-turnstile';
import { createLocalResultId, saveLocalResult } from '$lib/server/storage/mock-results';

function parseDeviceType(value: unknown): DeviceType | undefined {
  if (value === 'Mobile' || value === 'Desktop' || value === 'Tablet') return value;
  return undefined;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await readJsonObject(request);

    const history = parseHistory(body.history ?? []);
    if (history.length !== 20) throw validationProblem('결과 산출에는 정확히 20개 응답이 필요합니다.');
    validateReachableHistory(history, { allowComplete: true });

    await verifyBotVerificationGrant(body.turnstileToken);

    const playTimeSec = Number(body.playTimeSec);
    if (!Number.isFinite(playTimeSec)) throw validationProblem('playTimeSec가 필요합니다.');
    if (playTimeSec < 20) throw abuseProblem();

    const resultId = createLocalResultId();
    const publicResult = buildPublicResult({ resultId, history });
    const deviceType = parseDeviceType(body.deviceType);
    const utmSource = typeof body.utmSource === 'string' ? body.utmSource : undefined;

    saveLocalResult({
      ...publicResult,
      history,
      playTimeSec,
      deviceType,
      utmSource
    });

    return json(publicResult);
  } catch (error) {
    if (error instanceof ApiProblem) {
      return json({ error: { code: error.code, message: error.message } }, { status: error.status });
    }

    console.error(error);
    return json(
      { error: { code: 'server_error', message: '서버 내부 오류가 발생했습니다.' } },
      { status: 500 }
    );
  }
};
