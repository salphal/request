import type { HttpRequestConfig } from '../typings/http-request';
import type { CacheData, CacheType } from '../typings/cache';

class CacheStorage {
  cacheStorage: any;
  cacheData = new Map<string, any>();

  config: HttpRequestConfig = {
    cacheName: 'requestCacheStorage',
    cacheType: 'localStorage',
  };

  cacheType: CacheType = 'localStorage';
  cacheStorageName: string = 'requestCacheStorage';

  constructor(config: any = {}) {
    this.config = { ...this.config, ...config };
    if (this.config.cacheType) {
      this.cacheType = this.config.cacheType;
      this.initCacheStorage();
    }
    if (this.config.cacheName) {
      this.cacheStorageName = this.config.cacheName;
    }
  }

  initCacheStorage() {
    if (this.config.cacheStorage) {
      this.cacheStorage = this.config.cacheStorage;
    } else if (['localStorage', 'sessionStorage'].includes(this.cacheType)) {
      if (this.cacheType === 'localStorage') {
        this.cacheStorage = localStorage;
      } else if (this.cacheType === 'sessionStorage') {
        this.cacheStorage = sessionStorage;
      }
      this.setCacheStorage(new Map());
    }
  }

  set(key: string, data: any) {
    if (this.cacheType) {
      const cacheData = this.getCacheStorage();
      if (!(cacheData instanceof Map)) return;
      cacheData.set(key, data);
      this.setCacheStorage(cacheData);
    } else {
      this.cacheData.set(key, data);
    }
  }

  get(key: string) {
    if (this.cacheType) {
      const cacheData = this.getCacheStorage();
      if (cacheData instanceof Map && cacheData.has(key)) {
        const currentDate = new Date().getTime();
        const cache: CacheData = cacheData.get(key);
        if (cache.startTime && cache.expires && currentDate - cache.startTime > cache.expires) {
          this.remove(key);
          return null;
        } else {
          return { data: cache.data };
        }
      }
    } else {
      if (!this.cacheData.has(key)) return null;
      return this.cacheData.get(key);
    }
  }

  remove(key: string) {
    if (this.cacheType) {
      const cacheData = this.getCacheStorage();
      if (cacheData instanceof Map && cacheData.has(key)) {
        cacheData.delete(key);
        this.setCacheStorage(cacheData);
      }
    } else {
      if (!this.cacheData.has(key)) return;
      this.cacheData.delete(key);
    }
  }

  clear() {
    if (this.cacheType) {
      this.setCacheStorage(new Map());
    } else {
      this.cacheData.clear();
    }
  }

  getCacheStorage(): Map<string, any> | null {
    const strCacheData = this.cacheStorage.getItem(this.cacheStorageName);
    if (!strCacheData) return null;
    const cacheDataObj = JSON.parse(strCacheData);
    return new Map(Object.entries(cacheDataObj));
  }

  setCacheStorage(cacheData: Map<string, any>) {
    this.cacheStorage.setItem(
      this.cacheStorageName,
      JSON.stringify(Object.fromEntries(cacheData.entries())),
    );
  }
}

export default CacheStorage;
