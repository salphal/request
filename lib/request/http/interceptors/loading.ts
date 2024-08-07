import type {
  IHttpRequestConfig,
  IHttpResponse,
  RequestInterceptors,
  ResponseInterceptors,
} from '@lib/request/http/types/http-request';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

/** 批次中仍在处理中的请求数 */
let requestCount: number = 0;
/** 避免批量请求中调用多次 setLoading */
let requestLoading: boolean = false;

const START_DELAY_TIME: number = 100;
const END_DELAY_TIME: number = 100;

/**
 * 更新加载状态
 * @param config {IHttpRequestConfig} - 请求配置对象
 * @param loading - 加载状态
 */
const updateRequestLoading = (config: IHttpRequestConfig, loading: boolean) => {
  if ('setLoading' in config && typeof config.setLoading === 'function') {
    /** 记录 loading 状态, 避免在批量请求时, 多次调用 setLoading 设置同样的状态 */
    requestLoading = loading;
    /** 更新 loading 状态 */
    config.setLoading(loading);
  }
};

/**
 * 启动请求时，更新加载状态
 * @param config {IHttpRequestConfig} - 请求配置对象
 */
export const startRequest = (config: IHttpRequestConfig) => {
  /** 处理批量请求中 忽略loading 的请求 */
  if (config.ignoreLoading) return;
  /** 终止重复请求和批量请求加载不能同时使用 */
  if (config.abortAble) return;

  /** 单个请求 */
  if (config.loadingType === 'single') {
    updateRequestLoading(config, true);
    return;
  }

  requestCount += 1;

  /**
   * 如果请求启动后还没有结束，就会开始加载
   * 避免快速响应请求触发加载
   */
  setTimeout(() => {
    if (requestLoading) return;
    if (requestCount > 0) {
      updateRequestLoading(config, true);
    }
  }, START_DELAY_TIME);
};

/**
 * 结束请求，判断是否还有未完成的请求，然后更新加载状态s
 * @param config {IHttpRequestConfig} - 请求配置对象
 * @param loading {boolean} - 产生错误时, 直接设置为 false
 */
export const endRequest = (config: IHttpRequestConfig, loading?: boolean) => {
  if (loading === false) {
    updateRequestLoading(config, false);
  }
  /** 忽略不需要 setLoading 的请求 */
  if (config && config.ignoreLoading) return;

  /** 单个请求直接执行 setLoading */
  if (config.loadingType === 'single') {
    updateRequestLoading(config, false);
    return;
  }

  requestCount -= 1;

  /**
   * 响应后，如果还有未完成的请求，则继续等待
   * 等待所有请求响应后再更新加载状态
   */
  setTimeout(() => {
    if (!requestLoading) return;
    if (requestCount === 0) {
      updateRequestLoading(config, false);
    }
  }, END_DELAY_TIME);
};

export const loadingRequestInterceptors: RequestInterceptors<IHttpRequestConfig, AxiosInstance> = [
  (config) => {
    startRequest(config);
    return config;
  },
  (err, config, instance) => {
    endRequest(config, false);
    return Promise.reject(err);
  },
];

export const loadingResponseInterceptors: ResponseInterceptors<
  IHttpResponse<any>,
  IHttpRequestConfig,
  AxiosInstance
> = [
  (res, config, instance) => {
    if (res && res.config) endRequest(res.config as IHttpRequestConfig);
    return res;
  },
  (err: any, config, instance) => {
    endRequest(config, false);
    return Promise.reject(err);
  },
];
