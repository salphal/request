import type { HttpRequestConfig, InterceptorHookFunc } from '../typings/http-request';
import {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

/** The number of requests in the batch that are still in progress */
let requestCount = 0;

const START_DELAY_TIME = 100;
const END_DELAY_TIME = 100;

/**
 * Update loading status
 * @param config {HttpRequestConfig} - Request configuration object
 * @param loading - Loading status
 */
const updateRequestLoading = (config: HttpRequestConfig, loading: boolean) => {
  if (!config) return;
  if ('setLoading' in config && typeof config.setLoading === 'function') {
    config.setLoading(loading);
  }
};

/**
 * When starting a request, update the loading state
 * @param config {HttpRequestConfig} - Request configuration object
 */
export const startRequest = (config: HttpRequestConfig) => {
  if (!config) return;
  if (config && config.ignoreLoading) return;
  /** Terminating duplicate requests and batch request loading cannot be used at the same time. */
  if (config && config.abortAble) return;
  if (config.loadingType === 'single') {
    updateRequestLoading(config, true);
    return;
  }
  requestCount += 1;
  /**
   * If the request has not ended after it is started, loading will begin
   * Avoid fast-responding requests from triggering loading
   */
  setTimeout(() => {
    if (requestCount > 0) {
      console.log('=>(loading.ts:36) requestCount 11', requestCount);
      updateRequestLoading(config, true);
    }
  }, START_DELAY_TIME);
};

/**
 * End the request, determine whether there are any outstanding requests, and then update the loading status
 * @param config {HttpRequestConfig} - Request configuration object
 */
export const endRequest = (config: HttpRequestConfig) => {
  if (config && config.ignoreLoading) return;
  if (config.loadingType === 'single') {
    updateRequestLoading(config, false);
    return;
  }
  requestCount -= 1;
  /**
   * After responding, if there are still unfinished requests, continue to wait.
   * Wait for all requests to respond before updating the loading status
   */
  setTimeout(() => {
    if (requestCount === 0) {
      updateRequestLoading(config, false);
    }
  }, END_DELAY_TIME);
};

/**
 * Loading interceptor for loading control
 * @param instance {AxiosInstance} - axios instance
 */
const setUpLoadingInterceptor: InterceptorHookFunc = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
      startRequest(config);
      return config;
    },
    (err: AxiosError) => {
      return Promise.reject(err);
    },
  );
  instance.interceptors.response.use(
    (res: AxiosResponse) => {
      endRequest(res.config);
      return res;
    },
    (err: AxiosError) => {
      endRequest(err.config as HttpRequestConfig);
      return Promise.reject(err);
    },
  );
};

export default setUpLoadingInterceptor;
