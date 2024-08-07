import { createTokenByConfig } from '@lib/request/http/utils/token.ts';
import type { IHttpRequestConfig } from '@lib/request/http/types/http-request';
import type {
  IHttpResponse,
  RequestInterceptors,
  ResponseInterceptors,
} from '@lib/request/http/types/http-request';
import axios, { type AxiosInstance } from 'axios';

/** 存储请求中的请求 */
const requestQueue: Map<string, any> = new Map();

/**
 * @param config {IHttpRequestConfig} - 请求配置对象
 */
export const addPending = (config: IHttpRequestConfig): void => {
  if (config.abortAble === false) return;

  /** 根据请求配置对象获取请求唯一标识 */
  const token = createTokenByConfig(config);
  if (!token) return;

  /** 如果该请求是重复请求, 则取消该请求 */
  if (typeof config.cancelPendingCallback === 'function') {
    config.cancelPendingCallback(config, requestQueue, token);
  } else {
    /**
     * 取消请求方式_1: AbortController
     */
    // const controller = new AbortController();
    // config.signal = controller.signal;
    // if (requestQueue.has(token)) {
    //   // 不支持消息参数
    //   controller.abort();
    // } else {
    //   requestQueue.set(token, controller.abort);
    // }

    /**
     * 取消请求方式_2: CancelToken
     */
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    config.cancelToken = source.token;
    if (requestQueue.has(token)) {
      const message = `请求重复: ${token}, 请求已被取消( 可以通过 abortAble: false 禁用 )`;
      source.cancel(message, config);
      console.log(message);
    } else {
      requestQueue.set(token, source.cancel);
    }
  }
};

export const removePending = (config: IHttpRequestConfig): void => {
  /** 请求完毕, 移除该请求的唯一标识 */
  const token = createTokenByConfig(config);
  if (token && requestQueue.has(token)) {
    requestQueue.delete(token);
  }
};

export const pendingRequestInterceptors: RequestInterceptors<IHttpRequestConfig, AxiosInstance> = [
  (config) => {
    addPending(config);
    return config;
  },
  (err, config, instance) => {
    return Promise.reject(err);
  },
];

export const pendingResponseInterceptors: ResponseInterceptors<
  IHttpResponse<any>,
  IHttpRequestConfig,
  AxiosInstance
> = [
  (res, config, instance) => {
    if (res && res.config) removePending(res.config as IHttpRequestConfig);
    return res;
  },
  (err: any, config, instance) => {
    return Promise.reject(err);
  },
];
