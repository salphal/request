import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type Canceler,
  type InternalAxiosRequestConfig,
} from 'axios';
import { type HttpRequestConfig } from '../typings/http-request';
import { createTokenByConfig } from '../utils/token.ts';

const requestQueue: Map<string, Canceler> = new Map();

export const addPending = (config: HttpRequestConfig): void => {
  if (typeof config.abortAble !== 'boolean' || !config.abortAble) return;

  const token = createTokenByConfig(config);
  if (!token) return;

  const CancelToken = axios.CancelToken;
  const abortController = CancelToken.source();
  config.cancelToken = abortController.token;

  if (requestQueue.has(token)) {
    if (requestQueue.has(token)) {
      const message = `Request to repeat: ${token}, The request has been canceled( Can be disabled via abortAble: false )`;
      abortController.cancel(message, config);
      console.log(message);
    }
  } else {
    requestQueue.set(token, abortController.cancel);
  }
};

export const removePending = (config: HttpRequestConfig): void => {
  const token = createTokenByConfig(config);
  if (token && requestQueue.has(token)) {
    requestQueue.delete(token);
  }
};

export const clearAllPending = () => {
  for (const [token, cancel] of requestQueue) {
    cancel(
      `Request to repeat: ${token}, The request has been canceled( Can be disabled via abortAble: false )`,
    );
  }
  requestQueue.clear();
};

/**
 * 加载挂起的控制拦截器
 * @param instance {AxiosInstance} - axios 实例
 */
const setUpPendingInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
      addPending(config);
      return config;
    },
    (err: AxiosError) => {
      return Promise.reject(err);
    },
  );
  instance.interceptors.response.use(
    (res: AxiosResponse) => {
      removePending(res.config as HttpRequestConfig);
      return res;
    },
    (err: AxiosError) => {
      return Promise.reject(err);
    },
  );
};

export default setUpPendingInterceptor;
