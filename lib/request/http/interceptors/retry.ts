import type { IHttpRequestConfig } from '@lib/request/http/types/http-request';
import type { AxiosInstance } from 'axios';
import type {
  IHttpResponse,
  RequestInterceptors,
  ResponseInterceptors,
} from '@lib/request/http/types/http-request';

const retryRequest = (err: any, instance: AxiosInstance) => {
  const config = (err.config as IHttpRequestConfig) || {};

  if (config.retryAble === false) return Promise.reject(err);
  if (typeof config['retryCount'] !== 'number' || typeof config['retryMaxCount'] !== 'number')
    return Promise.reject(err);

  /** 重试指定次数后返回异常 */
  if (config.retryCount >= config.retryMaxCount) return Promise.reject(err);

  /** 记录重试次数 */
  config.retryCount += 1;

  const delay = new Promise<void>((resolve) => {
    console.error(
      `请求失败: ( 可以通过 retryAble: false 禁用 ), 重新请求 ${config['retryCount']} 次: ${config['url']}`,
    );
    setTimeout(() => {
      resolve();
    }, config['retryDelay'] || 1000);
  });

  return delay.then(() => {
    return instance.request(config);
  });
};

export const retryRequestInterceptors: RequestInterceptors<IHttpRequestConfig, AxiosInstance> = [
  (config) => {
    return config;
  },
  (err, config, instance) => {
    return Promise.reject(err);
  },
];

export const retryResponseInterceptors: ResponseInterceptors<
  IHttpResponse<any>,
  IHttpRequestConfig,
  AxiosInstance
> = [
  (res, config, instance) => {
    return res;
  },
  (err: any, config, instance) => {
    return retryRequest(err, instance);
  },
];
