import { createTokenByConfig } from '@lib/request/http/utils/token.ts';
import type { HttpRequestConfig } from '@lib/request/http/http-request';
import type { RequestInterceptors, ResponseInterceptors } from '@lib/request/http/http-request';

/** 存储请求中的请求 */
const requestQueue: Map<string, any> = new Map();

/**
 * @param config {HttpRequestConfig} - 请求配置对象
 */
export const addPending = (config: HttpRequestConfig): void => {
  if (config.abortAble === false) return;

  /** 根据请求配置对象获取请求唯一标识 */
  const token = createTokenByConfig(config);

  /** 如果该请求是重复请求, 则取消该请求 */
  if (token && typeof config.cancelPendingCallback === 'function') {
    config.cancelPendingCallback(config, requestQueue, token);
  }
};

export const removePending = (config: HttpRequestConfig): void => {
  /** 请求完毕, 移除该请求的唯一标识 */
  const token = createTokenByConfig(config);
  if (token && requestQueue.has(token)) {
    requestQueue.delete(token);
  }
};

export const clearAllPending = () => {
  for (const [token, cancel] of requestQueue) {
    cancel(`请求重复: ${token}, 请求已被取消( 可以通过 abortAble: false 禁用 )`);
  }
  requestQueue.clear();
};

export const pendingRequestInterceptors: RequestInterceptors = [
  (config) => {
    addPending(config);
    return config;
  },
  (err: any) => {
    return Promise.reject(err);
  },
];

export const pendingResponseInterceptors: ResponseInterceptors = [
  (res) => {
    removePending(res['config']);
    return res;
  },
  (err: any) => {
    return Promise.reject(err);
  },
];
