import {BACKEND_URL as ENV_BACKEND_URL} from '@env';

const DEFAULT_BACKEND_URL = 'http://localhost:3001/api';

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

export const BACKEND_URL = normalizeBaseUrl(
  ENV_BACKEND_URL || DEFAULT_BACKEND_URL,
);

export const UPLOAD_URL = `${BACKEND_URL}/upload`;
