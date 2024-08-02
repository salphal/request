export interface CacheData {
  /** 缓存数据 */
  data: any;
  /** 缓存有效期时间 */
  expires?: number;
  /** 开始缓存时间 */
  startTime?: number;
}

export interface CacheStorage {
  [key: string]: any;
  /** 设置缓存数据 */
  set: (key: string, value: any) => void;
  /** 根据 key 获取缓存 */
  get: (key: string) => any;
}

export type CacheType = 'localStorage' | 'sessionStorage' | 'map';
