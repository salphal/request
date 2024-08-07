import type { CacheData, CacheStore } from '@lib/request/http/types/cache-store';
import { type DBTables, TsIndexDB } from '@lib/request/http/utils/indexdb';

export interface IndexDBStormProps {
  dbName?: string;
  version?: number;
  tables?: DBTables[];
  tableName?: string;
}

class IndexDBStore implements CacheStore {
  store: TsIndexDB;
  dbName: string = 'cache_store';
  version: number = 1;
  tableName: string = 'cache_data';

  constructor() {
    this.store = new TsIndexDB({
      dbName: this.dbName,
      version: this.version,
      tables: [
        {
          tableName: this.tableName,
          options: {
            keyPath: 'token',
            // autoIncrement: true,
          },
          indexs: [
            // {
            //   key: 'id',
            //   options: {
            //     unique: true,
            //   },
            // },
            {
              key: 'token',
              options: {
                // unique: true,
              },
            },
            {
              key: 'data',
              options: {},
            },
          ],
        },
      ],
    });
    this.store.openDB();
  }
  async addCache(key: string, value: any) {
    return await this.store.insert({
      tableName: this.tableName,
      data: { token: key, ...value },
    });
  }

  async getCache(key: string) {
    return await this.store.query({
      tableName: this.tableName,
      condition(data: any) {
        return data.token === key;
      },
    });
  }

  async clearStore() {
    return await this.store.deleteTable(this.tableName);
  }

  async removeCache(key: string) {
    return await this.store.deleteByPrimaryKey({
      tableName: this.tableName,
      value: key,
    });
  }
}

export default IndexDBStore;
