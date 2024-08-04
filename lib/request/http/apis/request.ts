import {
  type HttpRequestInstance,
  HttpBaseRequest,
  HttpRequest,
  type HttpRequestConfig,
  type HttpResponse,
} from '@lib/request/http/http-request';
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import {
  loadingRequestInterceptors,
  loadingResponseInterceptors,
  startRequest,
} from '@lib/request/http/interceptors/loading.ts';

const httpRequest = new HttpRequest(
  (config) => {
    return axios.create(config as AxiosRequestConfig) as HttpRequestInstance;
  },
  {
    baseURL: '/api',
    requestInterceptorList: [
      [
        (config: HttpRequestConfig) => {
          return config;
        },
        (err: any) => {},
      ],
      loadingRequestInterceptors,
    ],
    responseInterceptorList: [
      [
        (res) => {
          return res;
        },
        (error) => {},
      ],
      loadingResponseInterceptors,
    ],
    setupRequestInterceptors: (instance, requestInterceptorList, httpRequestConfig) => {
      // axios 请求拦截器先定义的后生效
      requestInterceptorList.forEach((requestInterceptor) => {
        const [onFulfilled, onRejected] = requestInterceptor;
        (instance as AxiosInstance).interceptors.request.use(
          (config) => {
            onFulfilled({ ...httpRequestConfig, ...config });
            return config;
          },
          (err) => {
            onRejected({ ...httpRequestConfig, ...err });
          },
        );
      });
    },
    setupResponseInterceptors: (instance, responseInterceptorList, config) => {
      // axios 响应拦截器执行顺序不变
      responseInterceptorList.forEach((responseInterceptor) => {
        const [onFulfilled, onRejected] = responseInterceptor;
        (instance as AxiosInstance).interceptors.request.use(
          (res: any) => {
            onFulfilled({ ...config, ...res });
            return res;
          },
          (err: any) => {
            onRejected({ ...config, ...err });
          },
        );
      });
    },
  },
);

export default httpRequest;
