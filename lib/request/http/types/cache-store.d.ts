export type CacheType = 'indexDB' | 'map' | 'localStorage' | 'custom';

export interface CacheData {
  /** 根据请求配置对象生成的唯一标识 */
  token: string;
  /** 缓存有效期时间 */
  validityPeriod?: number;
  /** 开始缓存的时间 */
  startTime?: number;
  /** 缓存数据 */
  data: any;
}

export interface CacheStore<T = any> {
  /** 获取缓存 */
  getCache: (key: string) => T;
  /** 添加缓存 */
  addCache: (key: string, value: T) => void;
  /** 删除缓存 */
  removeCache: (key: string) => viod;
  /** 清空所有缓存 */
  clearStore: () => void;
}
