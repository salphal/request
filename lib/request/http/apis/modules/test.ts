import httpRequest from '../request.ts';
import type { HttpRequestConfig } from '@lib/request/http/typings/http-request';

const testBaseUrl = '/request';

/**
 * 自动缓存请求结果
 */
export const testCache = async (config: HttpRequestConfig = {}) => {
  return httpRequest.get({
    url: `${testBaseUrl}/test_cache`,
    cacheAble: true,
    ...config,
  });
};

/**
 * 自动设置加载状态（单个请求或批量请求）
 */
export const testLoading = async (config: HttpRequestConfig = {}) => {
  return httpRequest.get({
    url: `${testBaseUrl}/test_loading`,
    ...config,
  });
};

/**
 * 重复请求会自动取消
 */
export const testPending = async (config: HttpRequestConfig = {}) => {
  return httpRequest.get({
    url: `${testBaseUrl}/test_pending`,
    abortAble: true,
    retryAble: false,
    ...config,
  });
};

/**
 * 自动重试以响应错误
 */
export const testRetry = async (config: HttpRequestConfig = {}) => {
  return httpRequest.get({
    url: `${testBaseUrl}/test_retry`,
    abortAble: false,
    retryAble: true,
    ...config,
  });
};
