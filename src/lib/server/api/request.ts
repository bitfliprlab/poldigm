import { validationProblem } from '$lib/server/algorithm/errors';

export async function readJsonObject(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw validationProblem('request body는 JSON object여야 합니다.');
    }
    return body as Record<string, unknown>;
  } catch (error) {
    if (error instanceof Error && error.name === 'SyntaxError') {
      throw validationProblem('request body는 올바른 JSON이어야 합니다.');
    }
    throw error;
  }
}
