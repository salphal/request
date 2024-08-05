import { createTokenByConfig } from '../utils/token.ts';
import type {
  HttpRequestConfig,
  HttpRequestInstance,
  HttpResponse,
  RequestInterceptors,
  ResponseInterceptors,
} from '@lib/request/http/types/http-request';
import type { CacheData } from '@lib/request/http/types/cache-store';

export const addCache = (res: HttpResponse<any>, instance: HttpRequestInstance) => {
  const config: HttpRequestConfig = res.config;
  const data = res.data;
  if (!data) return;

  if (config.cacheAble === true) {
    const validityPeriod = config.validityPeriod || 86400 * 3;
    const token = createTokenByConfig(config);

    if (!token) return;

    const value: CacheData = {
      data,
      validityPeriod,
      startTime: new Date().getTime(),
    };

    if (instance.cacheStore && typeof instance.cacheStore.setCache === 'function') {
      instance.cacheStore.setCache(token, value);
    }
  }
};

export const getCache = (config: HttpRequestConfig) => {
  const token = createTokenByConfig(config);
  if (!token) return;
  // return cacheStorage.get(token);
};

export const cacheRequestInterceptors: RequestInterceptors = [
  (config) => {
    return config;
  },
  (err: any) => {
    return Promise.reject(err);
  },
];

export const cacheResponseInterceptors: ResponseInterceptors = [
  (res, config, instance) => {
    addCache(res, instance);
    return res;
  },
  (err: any) => {
    return Promise.reject(err);
  },
];
