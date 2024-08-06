import type {
  CreateInstance,
  HttpRequestConfig,
  HttpRequestInstance,
  IHttpBaseRequest,
  IHttpRequest,
} from '@lib/request/http/types/http-request';
import type { CacheData, CacheStore } from '@lib/request/http/types/cache-store';
import { createTokenByConfig } from '@lib/request/http/utils/token.ts';

class HttpBaseRequest implements IHttpBaseRequest {
  /** 请求配置对象 */
  config: HttpRequestConfig;
  /** 请求实例  */
  instance: HttpRequestInstance;
  /** 数据缓存仓库 */
  cacheStore: CacheStore | null = null;

  constructor(createInstance: CreateInstance, config: HttpRequestConfig) {
    /** 保存请求配置对象 */
    this.config = {
      cacheAble: false,
      cacheDuration: 86400 * 3,
      cacheType: 'localStorage',
      cacheName: 'requestCacheStorage',

      setLoading: (loading) => loading,
      ignoreLoading: false,
      loadingType: 'single',

      abortAble: false,

      retryAble: false,
      retryDelay: 1000,
      retryCount: 0,
      retryMaxCount: 3,

      requestInterceptorList: [],
      responseInterceptorList: [],

      ...config,
    };
    /** 创建请求实例 */
    this.instance = createInstance(this.config);
    /** 初始化缓存仓库 */
    if (typeof config.createCacheStore === 'function') {
      this.cacheStore = config.createCacheStore();
    }
    /** 开始装载拦截器 */
    this.setupInterceptors();
  }

  /** 默认请求方法 */
  request<T = any>(config: HttpRequestConfig): Promise<T> {
    if (config.cacheAble && this.cacheStore) {
      const token = createTokenByConfig(config);
      if (!token && typeof token === 'string') {
        const cachetData: CacheData = this.cacheStore.getCache(token);
        const currentDate = new Date().getTime();
      }
    }
    return new Promise((resolve, reject) => {
      try {
        this.instance
          .request({ ...this.config, ...config })
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

  /** 装载拦截器 */
  setupInterceptors() {
    if (
      this.config.requestInterceptorList?.length &&
      typeof this.config.setupRequestInterceptors === 'function'
    ) {
      this.config.setupRequestInterceptors(
        this.instance,
        this.config.requestInterceptorList,
        this.config,
      );
    }

    if (
      this.config.responseInterceptorList?.length &&
      typeof this.config.setupResponseInterceptors === 'function'
    ) {
      this.config.setupResponseInterceptors(
        this.instance,
        this.config.responseInterceptorList,
        this.config,
      );
    }
  }
}

class HttpRequest extends HttpBaseRequest implements IHttpRequest {
  post<T = any>(config: HttpRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' });
  }

  delete<T = any>(config: HttpRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' });
  }

  put<T = any>(config: HttpRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PUT' });
  }

  patch<T = any>(config: HttpRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PATCH' });
  }

  get<T = any>(config: HttpRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' });
  }

  graphql<T = any>(config: HttpRequestConfig): Promise<T> {
    const {
      query = '',
      operationName = '',
      variables = {},
      baseURL = '',
      graphqlBaseUrl,
      ...restProps
    } = config;
    const data = {
      query,
      operationName,
      variables,
    };
    const graphqlUrl = typeof graphqlBaseUrl === 'string' ? baseURL + graphqlBaseUrl : baseURL;
    return this.request({
      ...this.config,
      method: 'POST',
      baseURL: graphqlUrl,
      data,
      ...restProps,
    });
  }

  upload<T = any>(url: string, data: any, config?: HttpRequestConfig): Promise<T> {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    const newConfig: HttpRequestConfig = {
      ...this.config,
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
