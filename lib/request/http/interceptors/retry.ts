import {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { type HttpRequestConfig } from '../typings/http-request';

const responseInterceptorCatch = (err: AxiosError, instance: AxiosInstance) => {
  const config = (err.config as HttpRequestConfig) || {};

  if (typeof config.retryAble !== 'boolean' || !config.retryAble) return Promise.reject(err);
  if (typeof config.retryCount !== 'number' || typeof config.retryMaxCount !== 'number')
    return Promise.reject(err);

  /** 重试指定次数后返回异常 */
  if (config.retryCount >= config.retryMaxCount) return Promise.reject(err);

  /** 记录重试次数 */
  config.retryCount += 1;

  const delay = new Promise<void>((resolve) => {
    console.error(
      `Request failed (can be disabled via retryAble: false ), Re-request the interface ${config.retryCount} times: ${config.url}`,
    );
    setTimeout(() => {
      resolve();
    }, config.retryDelay || 1000);
  });

  return delay.then(() => {
    return instance.request(config);
  });
};

/**
 * 加载请求出错后, 重试拦截器
 * @param instance {AxiosInstance} - axios实例
 */
const setupRetryInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
      return config;
    },
    (err: AxiosError) => {
      return Promise.reject(err);
    },
  );
  instance.interceptors.response.use(
    (res: AxiosResponse) => {
      return res;
    },
    (err: AxiosError) => {
      return responseInterceptorCatch(err, instance);
    },
  );
};

export default setupRetryInterceptor;
