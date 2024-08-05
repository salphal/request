export type CacheType = 'map' | 'sessionStorage' | 'localStorage' | 'indexedDB';

export interface CacheData {
  /** 缓存数据 */
  data: any;
  /** 缓存有效期时间 */
  validityPeriod?: number;
  /** 开始缓存的时间 */
  startTime?: number;
}

export interface CacheStore {
  /** 获取缓存 */
  getCache: (key: string) => any;
  /** 添加缓存 */
  setCache: (key: string, value: any) => void;
  /** 删除缓存 */
  remoteCache: (key: string) => viod;
  /** 清空所有缓存 */
  clearStore: () => void;
}
