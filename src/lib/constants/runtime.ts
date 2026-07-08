import { env } from '$env/dynamic/public';

export const productionBaseUrl = 'https://poldigm.fliprlab.com';
export const appEnv = env.PUBLIC_APP_ENV || 'local';
export const appBaseUrl = env.PUBLIC_APP_BASE_URL || productionBaseUrl;
export const isLocalApp = appEnv === 'local';
