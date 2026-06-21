import type { PageServerLoad } from './$types';
import { getLocalResult } from '$lib/server/storage/mock-results';

export const load: PageServerLoad = ({ params }) => {
  return {
    result: getLocalResult(params.id),
    resultId: params.id
  };
};
