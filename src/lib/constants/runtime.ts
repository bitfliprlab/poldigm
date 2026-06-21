import { env } from '$env/dynamic/public';

export const appEnv = env.PUBLIC_APP_ENV || 'local';
export const appBaseUrl = env.PUBLIC_APP_BASE_URL || 'http://localhost:5173';
export const isLocalApp = appEnv === 'local';
