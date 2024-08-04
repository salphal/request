import httpRequest from '../request.ts';
import type { HttpRequestConfig } from '@lib/request/http/http-request';

const testBaseUrl = '/request';

/**
 * 自动缓存请求结果
 */
export const testRequest = async (config: HttpRequestConfig) => {
  return httpRequest.get({
    url: `${testBaseUrl}/test_cache`,
    ...config,
  });
};
