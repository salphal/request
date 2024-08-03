import { AxiosError, AxiosHeaders, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CacheStorage, CacheType } from './cache';

export interface HttpResponse<T> {
  [key: string]: any;

  /** 响应状态码 */
  code: number;
  /** 响应数据 */
  data: T;
  /** 响应消息 */
  message: string;
}

export interface InterceptorHook {
  /** 请求拦截器 thenable - resolve */
  requestInterceptor?: (config: HttpRequestConfig) => AxiosRequestConfig;
  /** 请求拦截器错误捕获 - reject */
  requestInterceptorCatch?: (error: AxiosError) => any;
  /** 响应拦截器 - resolve */
  responseInterceptor?: (response: AxiosResponse) => AxiosResponse;
  /** 响应拦截器错误捕获 - reject */
  responseInterceptorCatch?: (error: AxiosError) => any;
}

/** 加载自定义拦截器 */
export type InterceptorHookFunc = (instance: AxiosInstance) => void;

export type InterceptorHooks = Array<InterceptorHook | InterceptorHookFunc>;

export interface AxiosRequestHeaders extends AxiosHeaders {
  [key: string]: any;

  Accept?: string;
  Authorization?: string;
  'Content-Length'?: string;
  'User-Agent'?: string;
  'Content-Encoding'?: string;
}

export interface CacheInterceptorConfig {
  /** 是否缓存请求结果 */
  cacheAble?: boolean;
  /** 缓存时间( ms) */
  cacheDuration?: number;
  /** 缓存类型 */
  cacheType?: CacheType;
  /** 缓存数据集合的名称 */
  cacheName?: string;
  /** 缓存集合( 必须实现 get/set 方法 ) */
  cacheStorage?: CacheStorage;
}

export interface LoadingInterceptorConfig {
  /** 设置加载的方法 */
  setLoading?: (loading: boolean) => any;
  /** 是否不使用 loading( 批量请求时使用，某个请求忽略loading ) */
  ignoreLoading?: boolean;
  /** 加载类型: 单个请求 |多个请求 */
  loadingType?: 'single' | 'multi';
}

export interface PendingInterceptorConfig {
  /** 是否启用重复请求自动取消 */
  abortAble?: boolean;
}

export interface RetryInterceptorConfig {
  /** 失败后是否重试( 如果启用, 默认重试3次 ) */
  retryAble?: boolean;
  /** 重试延迟时间( 默认：1000ms ) */
  retryDelay?: number;
  /** 重试次数计数器( 默认：0 ) */
  retryCount?: number;
  /** 最大重试次数( 默认：3 ) */
  retryMaxCount?: number;
}

export interface GraphqlConfig {
  /** graphql 请求路径前缀 */
  graphqlBaseUrl?: string;
  /** graphql 语句名  */
  operationName?: string;
  /** graphql 语句 */
  query?: string;
  /** 参数集合 */
  variables?: any;
}

export interface HttpRequest extends AxiosRequestConfig {
  headers?: AxiosRequestHeaders | { [key: string]: string };
  /** 默认值为 0 ( 永不超时 ) */
  timeout?: number;
  /** 请求/响应拦 截器列表 */
  interceptorHooks?: InterceptorHooks;

  /** 请求拦截器列表 */
  requestInterceptorList?: RequestInterceptor[];

  /** 响应拦截器列表 */
  responseInterceptorList?: ResponseInterceptor[];
}

export type HttpRequestConfig = CacheInterceptorConfig &
  LoadingInterceptorConfig &
  PendingInterceptorConfig &
  RetryInterceptorConfig &
  GraphqlConfig &
  HttpRequest;

export interface RequestInstance {
  [key: string]: any;

  /** 发起请求的方法 */
  request: (config: any) => Promise<any>;
  /** 挂载请求拦截器的方法 */
  setupRequestInterceptors: (
    requestInstance: RequestInstance,
    requestInterceptorList: RequestInterceptor[],
  ) => void;
  /** 挂载响应拦截器的方法 */
  setupResponseInterceptors: (
    requestInstance: RequestInstance,
    responseInterceptorList: ResponseInterceptor[],
  ) => void;
}

export type CreateInstance = (config: any) => RequestInstance;

/** 请求拦截 */
export type RequestOnFulfilled = (config: HttpRequestConfig) => HttpRequestConfig;
/** 请求拦截错误捕获 */
export type RequestOnRejected = (error: any) => void;
/** 请求拦截器 */
export type RequestInterceptor = [RequestOnFulfilled, RequestOnRejected];

/** 响应拦截 */
export type ResponseOnFulfilled = (config: HttpRequestConfig) => HttpRequestConfig;
/** 响应拦截错误捕获 */
export type ResponseOnRejected = (error: any) => void;
/** 响应拦截器 */
export type ResponseInterceptor = [ResponseOnFulfilled, ResponseOnRejected];

// export interface RequestInterceptor {
//   /** Promise.resolve */
//   onFulfilled: (config: HttpRequestConfig) => HttpRequestConfig;
//   /** Promise.reject */
//   onRejected: (error: any) => void;
// }

// export interface ResponseInterceptor {
//   /** Promise.resolve */
//   onFulfilled: (config: HttpRequestConfig) => HttpRequestConfig;
//   /** Promise.reject */
//   onRejected: (error: any) => void;
// }
