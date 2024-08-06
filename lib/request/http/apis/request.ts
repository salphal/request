import { HttpRequest } from '@lib/request/http/http-request';
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import {
  loadingRequestInterceptors,
  loadingResponseInterceptors,
} from '@lib/request/http/interceptors/loading.ts';
import {
  pendingRequestInterceptors,
  pendingResponseInterceptors,
} from '@lib/request/http/interceptors/pending.ts';
import { retryResponseInterceptors } from '@lib/request/http/interceptors/retry.ts';
import type { HttpRequestConfig, HttpRequestInstance } from '@lib/request/http/types/http-request';
import MapStore from '@lib/request/http/utils/cache-store/map-store.ts';
import { cacheResponseInterceptors } from '@lib/request/http/interceptors/cache.ts';

const httpRequest = new HttpRequest(
  // 创建请求实例的方法
  (config) => {
    /**
     * 保留自定义请求实例的灵活度
     * 在这里为实例添加自定义方法及属性
     */
    const instance = axios.create(config as AxiosRequestConfig) as HttpRequestInstance;
    instance['sayHi'] = () => {
      console.log('hello word');
    };
    return instance;
  },
  {
    // 请求基础路径
    baseURL: '/api',
    /** 创建缓存数据仓库 */
    createCacheStore: () => {
      return new MapStore();
    },
    // 请求拦截器列表
    requestInterceptorList: [
      pendingRequestInterceptors, // 重复请求请求拦截器
      loadingRequestInterceptors, // loading 请求拦截器
      [
        (config) => {
          return config;
        },
        (err) => {
          return Promise.reject(err);
        },
      ],
    ],
    // 响应拦截器列表
    responseInterceptorList: [
      pendingResponseInterceptors, // 重复请求响应拦截器
      loadingResponseInterceptors, // loading 响应拦截器
      retryResponseInterceptors, // 重试错误请求( 默认重试3次 )
      cacheResponseInterceptors,
      [
        (res) => {
          return res;
        },
        (err) => {
          return Promise.reject(err);
        },
      ],
    ],
    /**
     * axios 中的 [ [..请求拦截器] + 请求 + [..响应拦截器] ] 放在一个数组中
     *  - axios的 请求拦截器 是向数组前面追加的 chain.unshift(requestInterceptor)
     *  - axios的 响应拦截器 是向数组后面追加的 chain.push(responseInterceptor)
     *  [ 请求拦截器2 请求拦截器1, 发送请求, 响应拦截器1, 响应拦截器2 ]
     */
    // 装载请求拦截器
    setupRequestInterceptors: (instance, requestInterceptorList, httpRequestConfig) => {
      // axios 请求拦截器先定义的后生效
      requestInterceptorList.reverse().forEach((requestInterceptor) => {
        const [onFulfilled, onRejected] = requestInterceptor;
        (instance as AxiosInstance).interceptors.request.use(
          (config) => {
            onFulfilled(config, httpRequestConfig, instance);
            return config;
          },
          (err) => {
            return onRejected(err, httpRequestConfig, instance);
          },
        );
      });
    },
    // 装载响应拦截器
    setupResponseInterceptors: (instance, responseInterceptorList, config) => {
      // axios 响应拦截器执行顺序不变
      responseInterceptorList.forEach((responseInterceptor) => {
        const [onFulfilled, onRejected] = responseInterceptor;
        (instance as AxiosInstance).interceptors.response.use(
          (res: any) => {
            onFulfilled(res, config, instance);
            return res;
          },
          (err: any) => {
            return onRejected(err, config, instance);
          },
        );
      });
    },
    // 取消请求的回调
    cancelPendingCallback: (
      config: HttpRequestConfig,
      requestQueue: Map<string, any>,
      token: string,
    ) => {
      /**
       * Axios cancellation
       * https://axios-http.com/docs/cancellation
       */

      /**
       * 取消请求方式_1: AbortController
       */
      // const controller = new AbortController();
      // config.signal = controller.signal;
      // if (requestQueue.has(token)) {
      //   // 不支持消息参数
      //   controller.abort();
      // } else {
      //   requestQueue.set(token, controller.abort);
      // }

      /**
       * 取消请求方式_2: CancelToken
       */
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      config.cancelToken = source.token;
      if (requestQueue.has(token)) {
        const message = `请求重复: ${token}, 请求已被取消( 可以通过 abortAble: false 禁用 )`;
        source.cancel(message, config);
        console.log(message);
      } else {
        requestQueue.set(token, source.cancel);
      }
    },
    beforeRequest(config: HttpRequestConfig) {},
  },
);

export default httpRequest;
