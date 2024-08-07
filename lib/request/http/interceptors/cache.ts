import { createTokenByConfig } from '../utils/token.ts';
import type { CacheData } from '@lib/request/http/types/cache-store';
import type {
  IHttpRequestConfig,
  IHttpResponse,
  RequestInterceptors,
  ResponseInterceptors,
} from '@lib/request/http/types/http-request';
import type { AxiosInstance } from 'axios';

export const addCache = (res: any, instance: AxiosInstance) => {
  const config = (res.config as IHttpRequestConfig) || {};

  const data = res.data;
  if (!data) return;

  if (config.cacheAble === true) {
    const validityPeriod = config.validityPeriod || 86400 * 3;
    const token = createTokenByConfig(config);

    if (!token) return;

    const value: CacheData = {
      data,
      token,
      validityPeriod,
      startTime: new Date().getTime(),
    };

    if (config.cacheStore && typeof config.cacheStore.addCache === 'function') {
      config.cacheStore.addCache(token, value);
    }
  }
};

export const getCache = (config: IHttpRequestConfig) => {
  const token = createTokenByConfig(config);
  if (!token) return;
  // return cacheStorage.get(token);
};

export const cacheRequestInterceptors: RequestInterceptors<IHttpRequestConfig, AxiosInstance> = [
  (config) => {
    return config;
  },
  (err, config, instance) => {
    return Promise.reject(err);
  },
];

export const cacheResponseInterceptors: ResponseInterceptors<
  IHttpResponse<any>,
  IHttpRequestConfig,
  AxiosInstance
> = [
  (res, config, instance) => {
    if (res && res.config) addCache(res, instance);
    return res;
  },
  (err: any, config, instance) => {
    return Promise.reject(err);
  },
];
