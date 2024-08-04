export interface HttpResponse<T> {
  [key: string]: any;

  code: number;
  data: T;
  message: string;
}

export type RequestOnFulfilled = (config: HttpRequestConfig) => HttpRequestConfig;
export type RequestOnRejected = (error: any) => void;
export type RequestInterceptors = [RequestOnFulfilled, RequestOnRejected];

export type ResponseOnFulfilled = <T = any>(res: HttpResponse<T>) => HttpResponse<T>;
export type ResponseOnRejected = (error: any) => void;
export type ResponseInterceptors = [ResponseOnFulfilled, ResponseOnRejected];

export type RequestInterceptorList = Array<RequestInterceptors>;
export type ResponseInterceptorList = Array<ResponseInterceptors>;

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
}

export type HttpRequestConfig = HttpRequestBaseConfig &
  LoadingInterceptorConfig &
  PendingInterceptorConfig;

export interface HttpRequestInstance {
  [key: string]: any;

  request: <T>(config: HttpRequestConfig) => Promise<T>;
}

export type CreateInstance = (config: HttpRequestConfig) => HttpRequestInstance;

class HttpBaseRequest {
  config: HttpRequestConfig;
  instance: HttpRequestInstance;

  constructor(createInstance: CreateInstance, config: HttpRequestConfig) {
    /** 保存请求配置对象 */
    this.config = {
      // cacheAble: false,
      // cacheDuration: 86400 * 3,
      // cacheType: 'localStorage',
      // cacheName: 'requestCacheStorage',

      setLoading: (loading) => loading,
      ignoreLoading: false,
      loadingType: 'single',

      abortAble: false,

      // retryAble: false,
      // retryDelay: 1000,
      // retryCount: 0,
      // retryMaxCount: 3,

      ...config,
    };

    /** 创建请求实例 */
    this.instance = createInstance(config);
    /** 开始装载拦截器 */
    this.setupInterceptors();
  }

  /** 默认请求方法 */
  request<T = any>(config: HttpRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      try {
        this.instance
          .request({ ...this.config, ...config })
          .then((res: any) => {
            console.log('=>(index.ts:103) res222', res);
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

class HttpRequest extends HttpBaseRequest {
  post<T = any>(config: HttpRequestConfig): Promise<T> {
    return this.request({ ...this.config, ...config, method: 'POST' });
  }

  delete<T = any>(config: HttpRequestConfig): Promise<T> {
    return this.request({ ...this.config, ...config, method: 'DELETE' });
  }

  put<T = any>(config: HttpRequestConfig): Promise<T> {
    return this.request({ ...this.config, ...config, method: 'PUT' });
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
