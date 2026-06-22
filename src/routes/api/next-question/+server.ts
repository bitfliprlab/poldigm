import { json, type RequestHandler } from '@sveltejs/kit';
import { ApiProblem } from '$lib/server/algorithm/errors';
import { nextQuestion } from '$lib/server/algorithm/questions';
import { parseHistory } from '$lib/server/algorithm/validation';
import { readJsonObject } from '$lib/server/api/request';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await readJsonObject(request);
    const history = parseHistory(body.history ?? []);
    const questionSeed = typeof body.questionSeed === 'string' ? body.questionSeed.slice(0, 80) : undefined;
    return json(nextQuestion(history, questionSeed));
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
