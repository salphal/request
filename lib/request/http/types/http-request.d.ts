import { CacheStore, CacheType } from '@lib/request/http/types/cache-store';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type RequestInterceptors<C, I> = [
  onFulfilled?: (config: C, instance: I) => C | Promise<C>,
  onRejected?: (err: any, config: C, instance: I) => any,
];

export type RequestInterceptorList = Array<RequestInterceptors>;

export type ResponseInterceptors<R, C, I> = [
  onFulfilled?: (res: R, config: C, instance: I) => R | Promise<V>,
  onRejected?: (err: any, config: C, instance: I) => any,
];

export type ResponseInterceptorList = Array<RequestInterceptors>;

export interface IBaseRequest<T, C> {
  /** 自定义请求实例 */
  instance: T;
  /** 请求配置对象 */
  config: C;
  /** 执行上下文 */
  context: any;
  /** 缓存数据的仓库 */
  cacheStore?: CacheStore | null;

  /** 请求拦截器列表 */
  requestInterceptorList?: RequestInterceptorList;
  /** 响应拦截器列表 */
  responseInterceptorList?: ResponseInterceptorList;

  /** request 请求之前触发的勾子 */
  beforeRequest?: (config: C) => any;

  /** 请求方法 */
  request<T = any, R = IHttpResponse<T>, D = any>(config: C<D>): Promise<R>;

  /** 请求适配器( 根据不同环境使用不同 API 发起请求 ) */
  requestAdapter?: (config: C) => any;

  /** 挂载请求拦截器列表的方法( 必须实现 ) */
  setupRequestInterceptors: () => void;
  /** 挂载响应拦截器列表的方法( 必须实现 ) */
  setupResponseInterceptors: () => void;
}

export interface IBaseRequestData {
  [key: string]: any;
}

export interface IHttpRequestInstance extends AxiosInstance {
  cacheStore: CacheStore;
}

export interface IBaseRequestCreateConfig extends AxiosRequestConfig<IBaseRequestData> {
  /** 请求拦截器列表 */
  requestInterceptorList: any[];
  /** 响应拦截器列表 */
  responseInterceptorList: any[];
  /** 缓存数据的仓库 */
  cacheStore: CacheStore;
}

export interface IBaseRequestConfig<D = any> extends AxiosRequestConfig<IBaseRequestData> {
  /** 请求拦截器列表 */
  requestInterceptorList?: any[];
  /** 响应拦截器列表 */
  responseInterceptorList?: any[];
  /** Get请求时携带的路径参数对象 */
  params?: D;
}

export interface IGraphqlData<D> {
  /** graphql 语句 */
  query: string;
  /** graphql 语句名称 */
  operationName?: string;
  /** graphql 的参数对象 */
  variables: D;
}

export interface IHttpRequest<C> {
  get<T = any, R = IHttpResponse<T>, P = any>(
    url: string,
    params?: P,
    config?: IBaseRequestConfig<P>,
  ): Promise<R>;

  delete<T = any, R = IHttpResponse<T>, P = any>(
    url: string,
    params?: P,
    config?: IBaseRequestConfig<P>,
  ): Promise<R>;

  post<T = any, R = IHttpResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: IBaseRequestConfig<D>,
  ): Promise<R>;

  put<T = any, R = IHttpResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: IBaseRequestConfig<D>,
  ): Promise<R>;

  patch<T = any, R = IHttpResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: IBaseRequestConfig<D>,
  ): Promise<R>;

  graphql<T = any, R = IHttpResponse<T>, D = any>(
    url: string,
    data?: IGraphqlData<D>,
    config?: IBaseRequestConfig<D>,
  ): Promise<R>;

  upload<T = any, R = IHttpResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: IBaseRequestConfig<D>,
  ): Promise<R>;
}

export interface IHttpResponse<T> extends AxiosResponse {}

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
  /** 缓存时间( ms) */
  validityPeriod?: number;
}

export type IHttpRequestConfig = IBaseRequestCreateConfig &
  LoadingInterceptorConfig &
  PendingInterceptorConfig &
  RetryInterceptorConfig &
  CacheInterceptorConfig;
