import { json, type RequestHandler } from '@sveltejs/kit';
import { ApiProblem } from '$lib/server/algorithm/errors';
import { nextQuestion } from '$lib/server/algorithm/questions';
import { parseHistory } from '$lib/server/algorithm/validation';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = (await request.json()) as { history?: unknown };
    const history = parseHistory(body.history ?? []);
    return json(nextQuestion(history));
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
