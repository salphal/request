import {
  type CreateInstance,
  type HttpRequestConfig,
  type RequestInstance,
  type RequestInterceptor,
  type ResponseInterceptor,
} from '../typings/http-request';
import { contentTypes } from '../constants/content-types.ts';
import { getCache } from '../interceptors/cache.ts';

/**
 * https://axios-http.com/zh/docs/post_example
 */

class HttpRequest {
  /**
   * 请求配置对象
   */
  config: HttpRequestConfig;
  /**
   * axios实例
   */
  instance: RequestInstance;
  /**
   * 请求/响应拦截器列表
   */
  // interceptorHooks: InterceptorHooks;

  /** 请求拦截器列表*/
  requestInterceptorList: Array<RequestInterceptor> = [];

  /** 响应拦截器列表 */
  responseInterceptorList: Array<ResponseInterceptor> = [];

  /**
   * @param config {HttpRequestConfig} - 请求配置参数
   * @param createInstance {(config: any) => Instance} - 创建请求实例的方法
   */
  constructor(config: HttpRequestConfig = {}, createInstance: CreateInstance) {
    if (typeof createInstance !== 'function') {
      throw new Error('Please check request parameter');
    }

    this.config = {
      cacheAble: false,
      cacheDuration: 86400 * 3,
      cacheType: 'localStorage',
      cacheName: 'requestCacheStorage',

      setLoading: () => {},
      ignoreLoading: false,
      loadingType: 'single',

      abortAble: false,

      retryAble: false,
      retryDelay: 1000,
      retryCount: 0,
      retryMaxCount: 3,

      ...config,
    };

    /** 创建请求实例 */
    this.instance = createInstance(this.config);
    this.config = config;
    /** 设置拦截器列表 */
    // this.interceptorHooks = config.interceptorHooks || [];
    this.requestInterceptorList = config.requestInterceptorList || [];
    this.responseInterceptorList = config.responseInterceptorList || [];
    /** 装载拦截器 */
    this.setupInterceptor();
  }

  request<T = any>(config: HttpRequestConfig): Promise<T> {
    if (config.cacheAble) {
      const data: T = getCache(config);
      if (data)
        return Promise.resolve({
          status: 200,
          config,
          ...data,
        });
    }
    return new Promise((resolve, reject) => {
      try {
        this.instance
          .request(config)
          .then((res: T) => {
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

  post<T = any>(config: HttpRequestConfig): Promise<T> {
    return this.request({ ...this.config, ...config, method: 'POST' });
  }

  delete<T = any>(config: HttpRequestConfig): Promise<T> {
    return this.request({ ...this.config, ...config, method: 'DELETE' });
  }

  patch<T = any>(config: HttpRequestConfig): Promise<T> {
    return this.request({ ...this.config, ...config, method: 'PATCH' });
  }

  get<T = any>(config: HttpRequestConfig): Promise<T> {
    return this.request({ ...this.config, ...config, method: 'GET' });
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
    return this.request({ method: 'POST', baseURL: graphqlUrl, data, ...restProps });
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
        'Content-Type': contentTypes.formData,
      },
    };
    return this.request(newConfig);
  }

  setupInterceptor(): void {
    /** 挂载请求拦截器 */
    if (Array.isArray(this.requestInterceptorList) && this.requestInterceptorList.length) {
      this.instance.setupRequestInterceptors(this.instance, this.requestInterceptorList);
    }

    /** 挂载响应拦截器 */
    if (Array.isArray(this.responseInterceptorList) && this.responseInterceptorList.length) {
      this.instance.setupResponseInterceptors(this.instance, this.responseInterceptorList);
    }

    //   if (!Array.isArray(this.interceptorHooks) || !this.interceptorHooks.length) return;
    //   /**
    //    * https://axios-http.com/docs/interceptors
    //    */
    //   this.interceptorHooks.forEach((interceptorHook: InterceptorHook | InterceptorHookFunc) => {
    //     /** 装载自定义拦截器 */
    //     if (typeof interceptorHook === 'function') {
    //       interceptorHook(this.instance);
    //     } else {
    //       // 请求拦截( 先定义后生效 )
    //       this.instance.interceptors.request.use(
    //         // @ts-ignore
    //         interceptorHook?.requestInterceptor,
    //         interceptorHook?.requestInterceptorCatch,
    //       );
    //       // 响应拦截( 执行顺序与定义顺序一致 )
    //       this.instance.interceptors.response.use(
    //         interceptorHook?.responseInterceptor,
    //         interceptorHook?.responseInterceptorCatch,
    //       );
    //     }
    //   });
  }
}

export default HttpRequest;
