import type { CacheStore } from '@lib/request/http/types/cache-store';
import type { CacheData } from '@lib/request/http/types/cache-store';

class MapStore implements CacheStore {
  store = new Map<string, any>();

  getCache(key: string): CacheData {
    return this.store.has(key) ? this.store.get(key) : null;
  }

  setCache(key: string, value: CacheData): void {
    this.store.set(key, value);
  }

  remoteCache(key: string) {
    this.store.has(key) && this.store.delete(key);
  }

  clearStore() {
    this.store.clear();
  }
}

export default MapStore;
