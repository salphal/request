import type {
  HttpRequestConfig,
  RequestInterceptors,
  ResponseInterceptors,
} from '@lib/request/http/http-request';

/** 批次中仍在处理中的请求数 */
let requestCount = 0;

const START_DELAY_TIME = 100;
const END_DELAY_TIME = 100;

/**
 * 更新加载状态
 * @param config {HttpRequestConfig} - 请求配置对象
 * @param loading - 加载状态
 */
const updateRequestLoading = (config: HttpRequestConfig, loading: boolean) => {
  if (!config) return;
  if ('setLoading' in config && typeof config.setLoading === 'function') {
    config.setLoading(loading);
  }
};

/**
 * 启动请求时，更新加载状态
 * @param config {HttpRequestConfig} - 请求配置对象
 */
export const startRequest = (config: HttpRequestConfig) => {
  if (!config) return;
  /** 处理批量请求中 忽略loading 的请求 */
  if (config && config.ignoreLoading) return;
  /** 终止重复请求和批量请求加载不能同时使用 */
  if (config && config.abortAble) return;
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
    if (requestCount > 0) {
      console.log('=>(loading.ts:36) requestCount 11', requestCount);
      updateRequestLoading(config, true);
    }
  }, START_DELAY_TIME);
};

/**
 * 结束请求，判断是否还有未完成的请求，然后更新加载状态s
 * @param config {HttpRequestConfig} - 请求配置对象
 */
export const endRequest = (config: HttpRequestConfig) => {
  if (config && config.ignoreLoading) return;
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
    if (requestCount === 0) {
      updateRequestLoading(config, false);
    }
  }, END_DELAY_TIME);
};

export const loadingRequestInterceptors: RequestInterceptors = [
  (config) => {
    startRequest(config);
    return config;
  },
  (err: any) => {},
];

export const loadingResponseInterceptors: ResponseInterceptors = [
  (res) => {
    endRequest(res);
    return res;
  },
  (err: any) => {
    err.setLoading(false);
  },
];
