import type { IHttpRequestConfig } from '@lib/request/http/types/http-request';

/**
 * Create unique token based on method, url, data, params, headers
 * @param config {HttpRequestConfig} - Request configuration object
 */
export const createTokenByConfig = (config: IHttpRequestConfig): string | null => {
  if (!config) return null;

  const { method, url, data, params, headers } = config;

  let token: string;

  if (method?.toUpperCase() === 'GET') {
    token = [method, url].join('&');
  } else {
    token = [
      method,
      url,
      JSON.stringify(data),
      JSON.stringify(params),
      JSON.stringify(headers),
    ].join('&');
  }

  return token.toLowerCase();
};
