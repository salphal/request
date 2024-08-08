import type { CacheData, CacheStore } from '@lib/request/http/types/cache-store';
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type {
  IBaseRequest,
  IBaseRequestConfig,
  IBaseRequestCreateConfig,
  IGraphqlData,
  IHttpRequest,
  IHttpRequestConfig,
  IHttpResponse,
  RequestInterceptorList,
  RequestInterceptors,
  ResponseInterceptorList,
  ResponseInterceptors,
} from '@lib/request/http/types/http-request';
import { createTokenByConfig } from '@lib/request/http/utils/token.ts';

/**
 * https://github.com/git-lt/axios-ext
 */

class HttpBaseRequest implements IBaseRequest<AxiosInstance, IBaseRequestConfig> {
  /** 请求实例 */
  instance: AxiosInstance;
  /** 缓存仓库( 默认使用 indexDB ) */
  cacheStore: CacheStore;
  /** 请求实例公共配置 */
  config: IBaseRequestConfig;
  /** 执行上下文 */
  context: any;
  /** 请求拦截器列表 */
  requestInterceptorList: RequestInterceptorList;
  /** 响应拦截器列表 */
  responseInterceptorList: ResponseInterceptorList;

  constructor(config: IBaseRequestCreateConfig) {
    this.instance = axios.create(config);
    this.cacheStore = config.cacheStore;
    this.config = config;
    this.requestInterceptorList = config.requestInterceptorList || [];
    this.responseInterceptorList = config.responseInterceptorList || [];
    this.setupRequestInterceptors();
    this.setupResponseInterceptors();
  }

  /**
   * 请求前置勾子
   * 主要用于 已缓存数据的请求直接返回
   * @param config {IBaseRequestConfig} - 请求配置对象
   */
  beforeRequest(config: IBaseRequestConfig): any {
    return { cacheData: {}, status: 200, hasCache: false };
  }

  async request<T = any, R = IHttpResponse<T>, D = any>(config: IBaseRequestConfig<D>): Promise<R> {
    const { hasCache, ...cacheData } = await this.beforeRequest({ ...this.config, ...config });
    if (hasCache) {
      return Promise.resolve(cacheData);
    }
    return new Promise((resolve, reject) => {
      try {
        this.instance
          .request<T, R>(config)
          .then((res: any) => {
            resolve(res);
          })
          .catch((err: any) => {
            reject(err);
          });
      } catch (err) {
        console.log(`request err: ${err}`);
      }
    });
  }

  /** 挂载请求拦截器 */
  setupRequestInterceptors(): void {
    if (Array.isArray(this.requestInterceptorList) && this.requestInterceptorList.length) {
      this.requestInterceptorList
        .reverse()
        .forEach((requestInterceptors: RequestInterceptors<AxiosRequestConfig, AxiosInstance>) => {
          const [onFulfilled, onRejected] = requestInterceptors;
          this.instance.interceptors.request.use(
            (config: any) => {
              return typeof onFulfilled === 'function'
                ? onFulfilled(config, this.instance)
                : config;
            },
            async (err) => {
              return typeof onRejected === 'function'
                ? onRejected(err, this.config, this.instance)
                : Promise.reject(err);
            },
          );
        });
    }
  }

  /** 挂载响应拦截器 */
  setupResponseInterceptors(): void {
    if (Array.isArray(this.responseInterceptorList) && this.responseInterceptorList.length) {
      this.responseInterceptorList.forEach(
        (
          responseInterceptors: ResponseInterceptors<
            AxiosResponse<any, any>,
            IBaseRequestConfig,
            AxiosInstance
          >,
        ) => {
          const [onFulfilled, onRejected] = responseInterceptors;
          this.instance.interceptors.response.use(
            (res) => {
              return typeof onFulfilled === 'function'
                ? onFulfilled(res, this.config, this.instance)
                : res;
            },
            (err) => {
              return typeof onRejected === 'function'
                ? onRejected(err, this.config, this.instance)
                : Promise.reject(err);
            },
          );
        },
      );
    }
  }
}

class HttpRequest extends HttpBaseRequest implements IHttpRequest<IHttpRequestConfig> {
  constructor(config: IHttpRequestConfig) {
    super({
      // setLoading: (loading: boolean) => loading,
      ignoreLoading: false,
      loadingType: 'single',

      abortAble: false,

      retryAble: false,
      retryDelay: 1000,
      retryCount: 0,
      retryMaxCount: 3,

      cacheAble: false,
      validityPeriod: 86400 * 3,
      cacheType: 'localStorage',
      cacheName: 'requestCacheStorage',

      // requestInterceptorList: [],
      // responseInterceptorList: [],

      ...config,
    });
  }

  /**
   * 重写若已缓存请求, 并且缓存时间还在生效中, 则直接返回缓存的结果
   * @param config
   */
  override async beforeRequest(config: IHttpRequestConfig) {
    if (config.cacheAble && this.cacheStore) {
      const token = createTokenByConfig(config);
      if (token) {
        const [cacheData] = await config.cacheStore.getCache(token);
        if (cacheData) {
          if (cacheData) {
            const currentDate = new Date().getTime();
            /** 判断缓存数据是否还在有效期 */
            if (
              cacheData.startTime &&
              cacheData.validityPeriod &&
              currentDate - cacheData.startTime > cacheData.validityPeriod
            ) {
              return {
                data: cacheData.data || {},
                status: 200,
                hasCache: true,
                config,
              };
            } else {
              /** 移除不在有效期的数据 */
              config.cacheStore.removeCache(token);
            }
          }
        }
      }
    }
    return { data: null, hasCache: false };
  }

  get<T = any, R = IHttpResponse<T>, P = any>(
    url: string,
    params?: P,
    config?: IBaseRequestConfig<P>,
  ): Promise<R> {
    return this.request({ ...config, url, params, method: 'GET' });
  }

  delete<T = any, R = IHttpResponse<T>, P = any>(
    url: string,
    params?: P,
    config?: IBaseRequestConfig<P>,
  ): Promise<R> {
    return this.request({ ...config, url, params, method: 'DELETE' });
  }

  post<T = any, R = IHttpResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: IBaseRequestConfig<D>,
  ): Promise<R> {
    return this.request(
      data ? { ...config, url, data, method: 'POST' } : { ...config, url, method: 'POST' },
    );
  }

  put<T = any, R = IHttpResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: IBaseRequestConfig<D>,
  ): Promise<R> {
    return this.request(
      data ? { ...config, url, data, method: 'PUT' } : { ...config, url, method: 'PUT' },
    );
  }

  patch<T = any, R = IHttpResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: IBaseRequestConfig<D>,
  ): Promise<R> {
    return this.request(
      data ? { ...config, url, data, method: 'PATCH' } : { ...config, url, method: 'PATCH' },
    );
  }

  graphql<T = any, R = IHttpResponse<T>, D = any>(
    url: string,
    data?: IGraphqlData<D>,
    config?: IBaseRequestConfig<D>,
  ): Promise<T> {
    return this.request(
      data ? { ...config, url, data, method: 'POST' } : { ...config, url, method: 'POST' },
    );
  }

  upload<T = any, R = IHttpResponse<T>, D = any>(
    url: string,
    data?: any,
    config?: IBaseRequestConfig,
  ): Promise<R> {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    const newConfig: IBaseRequestConfig = {
      ...config,
      url,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return this.request(newConfig);
  }
}

export { HttpBaseRequest, HttpRequest };
