import type { CacheStore } from '@lib/request/http/types/cache-store';

class LocalstorageStore implements CacheStore {
  store = window.localStorage;

  getCache(key: string) {
    const value = this.store.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  addCache(key: string, value: any): void {
    this.store.setItem(key, JSON.stringify(value));
  }

  removeCache(key: string) {
    this.store.removeItem(key);
  }

  clearStore() {
    this.store.clear();
  }
}

export default LocalstorageStore;
