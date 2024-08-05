import type { CacheData, CacheStore } from '@lib/request/http/types/cache-store';

class IndexdbStore implements CacheStore {
  getCache(token: string): CacheData {
    return {
      data: {},
    };
  }

  setCache(token: string, value: CacheData): void {}

  remoteCache(token: string) {}

  clearStore(): void {}
}

export default IndexdbStore;
