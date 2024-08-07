import { HttpRequest } from '@lib/request/http/http-request';
import IndexDBStore from '@lib/request/http/utils/cache-store/indexdb-store';
import {
  loadingRequestInterceptors,
  loadingResponseInterceptors,
} from '@lib/request/http/interceptors/loading';
import {
  pendingRequestInterceptors,
  pendingResponseInterceptors,
} from '@lib/request/http/interceptors/pending.ts';
import { retryResponseInterceptors } from '@lib/request/http/interceptors/retry';
import { cacheResponseInterceptors } from '@lib/request/http/interceptors/cache.ts';

const request = new HttpRequest({
  baseURL: '/api',
  requestInterceptorList: [
    pendingRequestInterceptors, // 重复请求请求拦截器
    loadingRequestInterceptors, // loading 请求拦截器
  ],
  responseInterceptorList: [
    pendingResponseInterceptors, // 重复请求响应拦截器
    loadingResponseInterceptors, // loading 响应拦截器
    retryResponseInterceptors, // 重试错误请求( 默认重试3次 )
    cacheResponseInterceptors, // 缓存成功的请求结果
  ],
  cacheStore: new IndexDBStore(),
});

export default request;
