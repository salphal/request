import { CacheType } from '@lib/request/http/utils/cache-storage.ts';
import { CacheStore } from '@lib/request/http/types/cache-store';

export interface HttpResponse<T> {
  [key: string]: any;

  /** 响应状态码 */
  code: number;
  /** 响应数据 */
  data: T;
  /** 响应消息 */
  message: string;

  /** 请求配置对象 */
  config: HttpRequestConfig;
}

export type RequestOnFulfilled = (
  config: HttpRequestConfig,
  httpRequestConfig: HttpRequestConfig,
  instance: HttpRequestInstance,
) => HttpRequestConfig | Promise<HttpRequestConfig>;
export type RequestOnRejected = (
  error: any,
  config: HttpRequestConfig,
  instance: HttpRequestInstance,
) => void;
export type RequestInterceptors = [RequestOnFulfilled, RequestOnRejected];

export type ResponseOnFulfilled = <T = any>(
  res: HttpResponse<T>,
  config: HttpRequestConfig,
  instance: HttpRequestInstance,
) => HttpResponse<T> | Promise<HttpRequestConfig>;
export type ResponseOnRejected = (
  error: any,
  config: HttpRequestConfig,
  instance: HttpRequestInstance,
) => void;
export type ResponseInterceptors = [ResponseOnFulfilled, ResponseOnRejected];

export type RequestInterceptorList = Array<RequestInterceptors>;
export type ResponseInterceptorList = Array<ResponseInterceptors>;

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

export interface LoadingInterceptorConfig {
  /** 当前 loading 的状态 */
  loading?: boolean;
  /** 设置加载的方法 */
  setLoading?: (loading: boolean) => any;
  /** 是否不使用 loading( 批量请求时使用，某个请求忽略loading ) */
  ignoreLoading?: boolean;
  /** 加载类型: 单个请求 |多个请求 */
  loadingType?: 'single' | 'multi';
}

export interface PendingInterceptorConfig {
  [key: string]: any;
  /** 用于取消请求的标识 */
  cancelToken?: any;
  signal?: any;
  /** 是否启用重复请求自动取消 */
  abortAble?: boolean;
  /** 取消请求的回调方法 */
  cancelPendingCallback?: (
    config: HttpRequestConfig,
    requestQueue: Map<string, any>,
    token: string,
  ) => void;
}

export interface RetryInterceptorConfig {
  /** 失败后是否重试( 如果启用, 默认重试3次 ) */
  retryAble?: boolean;
  /** 重试延迟时间( 默认：1000ms ) */
  retryDelay?: number;
  /** 重试次数( 默认：0 ) */
  retryCount?: number;
  /** 最大重试次数( 默认：3 ) */
  retryMaxCount?: number;
}

export interface CacheInterceptorConfig {
  /** 是否缓存请求结果 */
  cacheAble?: boolean;
  /** 缓存数据集合的名称 */
  cacheName?: string;
  /** 缓存类型 */
  cacheType?: CacheType;
  /** 创建缓存数据的仓库 */
  createCacheStore?: () => CacheStore;
  /** 缓存时间( ms) */
  validityPeriod?: number;
}

export interface HttpRequestBaseConfig {
  [key: string]: any;
  /** 请求头 */
  headers?: { [key: string]: any };
  /** 请求拦截器列表 */
  requestInterceptorList?: RequestInterceptorList;
  /** 挂载请求拦截器列表的方法( 必须实现 ) */
  setupRequestInterceptors?: (
    instance: HttpRequestInstance,
    requestInterceptorList: RequestInterceptorList,
    config: HttpRequestConfig,
  ) => void;
  /** 响应拦截器列表 */
  responseInterceptorList?: ResponseInterceptorList;
  /** 挂载响应拦截器列表的方法( 必须实现 ) */
  setupResponseInterceptors?: (
    instance: HttpRequestInstance,
    responseInterceptorList: ResponseInterceptorList,
    config: HttpRequestConfig,
  ) => void;
  /** 请求适配器( 根据不同环境使用不同 API 发起请求 ) */
  requestAdapter?: (config: HttpRequestConfig) => any;
  /** request 请求之前触发的勾子 */
  beforeRequest?: (config: HttpRequestConfig) => any;
}

export type HttpRequestConfig = HttpRequestBaseConfig &
  LoadingInterceptorConfig &
  PendingInterceptorConfig &
  RetryInterceptorConfig &
  CacheInterceptorConfig;

export interface IHttpBaseRequest {
  [key: string]: any;
  /** 请求配置对象 */
  config: HttpRequestConfig;
  /** 自定义请求实例 */
  instance: HttpRequestInstance;
  /** 缓存数据的仓库 */
  cacheStore: CacheStore | null;
  /** 请求方法 */
  request: <T>(config: HttpRequestConfig) => Promise<T>;
  /** 挂载拦截器的方法 */
  setupInterceptors: () => void;
}

export interface IHttpRequest extends IHttpBaseRequest {
  [key: string]: any;
  post: <T>(config: HttpRequestConfig) => Promise<T>;
  delete: <T>(config: HttpRequestConfig) => Promise<T>;
  put: <T>(config: HttpRequestConfig) => Promise<T>;
  patch: <T>(config: HttpRequestConfig) => Promise<T>;
  get: <T>(config: HttpRequestConfig) => Promise<T>;
  graphql: <T>(config: HttpRequestConfig) => Promise<T>;
  upload: <T>(url: string, data: any, config?: HttpRequestConfig) => Promise<T>;
}

export interface HttpRequestInstance {
  [key: string]: any;
  request: <T>(config: HttpRequestConfig) => Promise<T>;
}

export type CreateInstance = (config: HttpRequestConfig) => HttpRequestInstance;
