import { AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { type HttpRequestConfig } from '../typings/http-request';
import { createTokenByConfig } from '../utils/token.ts';
import CacheStorage from '../utils/cache-storage.ts';
import { type CacheData } from '../typings/cache';

const cacheStorage = new CacheStorage();

export const addCache = (res: AxiosResponse) => {
  const config: HttpRequestConfig = res.config as HttpRequestConfig;
  const data = res.data;
  if (!data) return;
  if (config && 'cacheAble' in config && config.cacheAble) {
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

const setUpCacheInterceptor = (instance: AxiosInstance) => {
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
      addCache(res);
      return res;
    },
    (err: AxiosError) => {
      return Promise.reject(err);
    },
  );
};

export default setUpCacheInterceptor;
