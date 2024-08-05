import { createTokenByConfig } from '../utils/token.ts';
import CacheStorage, { type CacheData } from '../utils/cache-storage.ts';
import type { HttpRequestConfig, HttpResponse } from '@lib/request/http/http-request';
import type { RequestInterceptors, ResponseInterceptors } from '@lib/request/http/http-request';

const cacheStorage = new CacheStorage();

export const addCache = (res: HttpResponse<any>) => {
  const config: HttpRequestConfig = res.config;
  const data = res.data;
  if (!data) return;

  if (config.cacheAble === true) {
    const expires = config.cacheDuration || 86400 * 3;
    const token = createTokenByConfig(config);

    if (!token) return;

    const value: CacheData = {
      data,
      expires: expires,
      startTime: new Date().getTime(),
    };

    cacheStorage.set(token, value);
  }
};

export const getCache = (config: HttpRequestConfig) => {
  const token = createTokenByConfig(config);
  if (!token) return;
  return cacheStorage.get(token);
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
  (res) => {
    addCache(res);
    return res;
  },
  (err: any) => {
    return Promise.reject(err);
  },
];
