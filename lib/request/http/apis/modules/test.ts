import httpRequest from '../request.ts';

const testBaseUrl = '/request';

/**
 * 自动设置加载状态( 单个请求或批量请求 )
 */
export const testLoading = async (params?: any, config: any = {}) => {
  return httpRequest.get(
    `${testBaseUrl}/test_loading`,
    {},
    {
      loadingType: 'multi',
      ...config,
    },
  );
};

/**
 * 重复请求会自动取消
 */
export const testPending = async (config: any = {}) => {
  return httpRequest.get(`${testBaseUrl}/test_pending`, null, {
    abortAble: true,
    retryAble: false,
    ...config,
  });
};

/**
 * 自动重试以响应错误
 */
export const testRetry = async (config: any = {}) => {
  return httpRequest.get(`${testBaseUrl}/test_retry`, null, {
    abortAble: false,
    retryAble: true,
    ...config,
  });
};

/**
 * 自动缓存请求结果
 */
export const testCache = async (config: any = {}) => {
  return httpRequest.get(`${testBaseUrl}/test_cache`, null, {
    cacheAble: true,
    ...config,
  });
};
