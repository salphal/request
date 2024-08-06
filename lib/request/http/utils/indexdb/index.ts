/**
 * https://github.com/swcbo/ts-indexdb/blob/master/README.md
 */

export type IndexDBConfig = {
  dbName: string;
  version: number;
  tables: DBTables[];
};

export type DBIndexs = { key: string; options?: IDBIndexParameters };

export type DBTables = {
  /** 设置表格名称 */
  tableName: string;
  /**
   * @param options {IDBObjectStoreParameters} - 列表配置
   *  @property keyPath {string} - 设置主键
   *  @property autoIncrement {boolean} - 是否自增
   */
  options?: IDBObjectStoreParameters;
  /** 表创建信息 */
  indexs: DBIndexs[];
};

export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

interface MapCondition {
  equal: (value: any) => IDBKeyRange;
  gt: (lower: any, open?: boolean) => IDBKeyRange;
  lt: (upper: any, open?: boolean) => IDBKeyRange;
  between: (lower: any, upper: any, lowerOpen?: boolean, upperOpen?: boolean) => IDBKeyRange;
}

export interface DBOperate<T> {
  tableName: string;
  key: string;
  data: T | T[];
  value: string | number;
  countCondition: { type: 'equal' | 'gt' | 'lt' | 'between'; rangeValue: [any, any?, any?, any?] };

  condition(data: T): boolean;

  success(res: T[] | T): void;

  handle(res: T): void;
}

export class TsIndexDB {
  /** 数据库名称 */
  private dbName: string = '';
  /** 数据库版本 */
  private version: number = 1;
  /** 数据库列表 */
  private tableList: DBTables[] = [];
  /** 数据库实例 */
  private database: IDBDatabase | null = null;
  /** 事务队列，实例化一次以后下次打开页面时数据库自启动 */
  private queue: (() => void)[] = [];

  constructor({ dbName, version, tables }: IndexDBConfig) {
    this.dbName = dbName;
    this.version = version;
    this.tableList = tables;
  }

  private static _instance: TsIndexDB | null = null;

  public static getInstance(dbOptions?: IndexDBConfig): TsIndexDB {
    if (TsIndexDB._instance === null && dbOptions) {
      TsIndexDB._instance = new TsIndexDB(dbOptions);
    }
    return TsIndexDB._instance!;
  }

  //=================relate select================================

  /**
   * @method 查询某张表的所有数据(返回具体数组)
   * @param {Object}
   *   @property {String} tableName - 表名
   */
  queryAll<T>({ tableName }: Pick<DBOperate<T>, 'tableName'>) {
    const res: T[] = [];
    return this.commitDB<T[]>(
      tableName,
      (transaction: IDBObjectStore) => transaction.openCursor(),
      'readonly',
      (e: any, resolve: (data: T[]) => void) => {
        this.cursorSuccess(e, {
          condition: () => true,
          handler: ({ currentValue }: any) => res.push(currentValue),
          success: () => resolve(res),
        });
      },
    );
  }

  /**
   * @method 查询(返回具体数组)
   * @param {Object}
   *   @property {String} tableName - 表名
   *   @property {Function} condition - 查询的条件
   * */
  query<T>({ tableName, condition }: Pick<DBOperate<T>, 'condition' | 'tableName'>) {
    const res: T[] = [];
    return this.commitDB<T[]>(
      tableName,
      (transaction: IDBObjectStore) => transaction.openCursor(),
      'readonly',
      (e: any, resolve: (data: T[]) => void) => {
        this.cursorSuccess(e, {
          condition,
          handler: ({ currentValue }: any) => res.push(currentValue),
          success: () => resolve(res),
        });
      },
    );
  }

  /**
   * @method 查询满足key条件的个数(返回满足条件的数字个数)
   * @param {Object}
   *   @property {String} tableName - 表名
   *   @property {Number|String} key - 查询的key
   *   @property {Object} countCondition - 查询条件
   */
  /**
   * countCondition传入方式 key 必须为已经简历索引的字段
   *
   * key ≥ x                {key: 'gt' rangeValue: [x]}
   * key > x                {key: 'gt' rangeValue: [x, true]}
   * key ≤ y                {key: 'lt' rangeValue: [y]}
   * key < y                {key: 'lt' rangeValue: [y, true]}
   * key ≥ x && ≤ y         {key: 'between' rangeValue: [x, y]}
   * key > x &&< y          {key: 'between' rangeValue: [x, y, true, true]}
   * key > x && ≤ y         {key: 'between' rangeValue: [x, y, true, false]}
   * key ≥ x &&< y          {key: 'between' rangeValue: [x, y, false, true]}
   * key = z                {key: 'equal' rangeValue: [z]}
   */
  count<T>({
    tableName,
    key,
    countCondition,
  }: Pick<DBOperate<T>, 'key' | 'tableName' | 'countCondition'>) {
    const mapCondition: MapCondition = {
      equal: IDBKeyRange.only,
      gt: IDBKeyRange.lowerBound,
      lt: IDBKeyRange.upperBound,
      between: IDBKeyRange.bound,
    };
    return this.commitDB<T>(
      tableName,
      (transaction: IDBObjectStore) =>
        transaction
          .index(key)
          .count(mapCondition[countCondition.type](...countCondition.rangeValue)),
      'readonly',
      (e: any, resolve: (data: T) => void) => {
        resolve(e.target.result || null);
      },
    );
  }

  /**
   * @method 查询数据( 更具表具体属性 ) 返回具体某一个
   * @param {Object}
   *   @property {String} tableName - 表名
   *   @property {Number|String} key - 名
   *   @property {Number|String} value - 值
   *
   * */
  queryByKeyValue<T>({ tableName, key, value }: Pick<DBOperate<T>, 'tableName' | 'key' | 'value'>) {
    return this.commitDB<T>(
      tableName,
      (transaction: IDBObjectStore) => transaction.index(key).get(value),
      'readonly',
      (e: any, resolve: (data: T) => void) => {
        resolve(e.target.result || null);
      },
    );
  }

  /**
   * @method 查询数据（主键值）
   * @param {Object}
   *   @property {String} tableName - 表名
   *   @property {Number|String} value - 主键值
   *
   * */
  queryByPrimaryKey<T>({ tableName, value }: Pick<DBOperate<T>, 'tableName' | 'value'>) {
    return this.commitDB<T>(
      tableName,
      (transaction: IDBObjectStore) => transaction.get(value),
      'readonly',
      (e: any, resolve: (data: T) => void) => {
        resolve(e.target.result || null);
      },
    );
  }

  //================= relate update ================================

  /**
   * @method 修改数据(返回修改的数组)
   * @param {Object}
   *   @property {String} tableName - 表名
   *   @property {Function} condition - 查询的条件，遍历，与filter类似
   *      @arg {Object} - 每个元素
   *      @return 条件
   *   @property {Function} handle - 处理函数，接收本条数据的引用，对其修改
   * */
  update<T>({
    tableName,
    condition,
    handle,
  }: Pick<DBOperate<T>, 'tableName' | 'condition' | 'handle'>) {
    const res: T[] = [];
    return this.commitDB<T>(
      tableName,
      (transaction: IDBObjectStore) => transaction.openCursor(),
      'readwrite',
      (e: any, resolve: (data: T[]) => void) => {
        this.cursorSuccess(e, {
          condition,
          handler: ({ currentValue, cursor }: any) => {
            const value = handle(currentValue);
            res.push(value as any);
            cursor.update(value);
          },
          success: () => {
            resolve(res);
          },
        });
      },
    );
  }

  /**
   * @method 修改某条数据( 主键 )返回修改的对象
   * @param {Object}
   *   @property {String} tableName - 表名
   *   @property {String\|Number} value - 目标主键值
   *   @property {Function} handle - 处理函数，接收本条数据的引用，对其修改
   * */
  updateByPrimaryKey<T>({
    tableName,
    value,
    handle,
  }: Pick<DBOperate<T>, 'tableName' | 'value' | 'handle'>) {
    return this.commitDB<T>(
      tableName,
      (transaction: IDBObjectStore) => transaction.get(value),
      'readwrite',
      (e: any, resolve: (data: T | null) => void, store: IDBObjectStore) => {
        const currentValue = e.target.result;
        if (!currentValue) {
          resolve(null);
          return;
        }
        const value = handle(currentValue);
        store.put(value);
        resolve(value as any);
      },
    );
  }

  //================= relate insert ================================

  /**
   * @method 增加数据
   * @param {Object}
   *   @property {String} tableName 表名
   *   @property {Object} data 插入的数据
   * */
  insert<T>({ tableName, data }: Pick<DBOperate<T>, 'tableName' | 'data'>) {
    return this.commitDB<T>(
      tableName,
      undefined,
      'readwrite',
      (_: any, resolve: () => void, store: IDBObjectStore) => {
        data instanceof Array ? data.forEach((v) => store.put(v)) : store.put(data);
        resolve();
      },
    );
  }

  //================= relate delete ================================

  /**
   * @method 删除数据( 返回删除数组 )
   * @param {Object}
   *   @property {String} tableName 表名
   *   @property {Function} condition 查询的条件，遍历，与 filter 类似
   *      @arg {Object} 每个元素
   *      @return 条件
   * */
  delete<T>({ tableName, condition }: Pick<DBOperate<T>, 'tableName' | 'condition'>) {
    const res: T[] = [];
    return this.commitDB<T>(
      tableName,
      (transaction: IDBObjectStore) => transaction.openCursor(),
      'readwrite',
      (e: any, resolve: (data: T[]) => void) => {
        this.cursorSuccess(e, {
          condition,
          handler: ({ currentValue, cursor }: any) => {
            res.push(currentValue);
            cursor.delete();
          },
          success: () => {
            resolve(res);
          },
        });
      },
    );
  }

  /**
   * @method 删除数据( 主键 )
   * @param {Object}
   *   @property {String} tableName 表名
   *   @property {String\|Number} value 目标主键值
   * */
  deleteByPrimaryKey<T>({ tableName, value }: Pick<DBOperate<T>, 'tableName' | 'value'>) {
    return this.commitDB<T>(
      tableName,
      (transaction: IDBObjectStore) => transaction.delete(value),
      'readwrite',
      (e: any, resolve: () => void) => {
        resolve();
      },
    );
  }

  //================= relate db ================================

  /**
   * @method 打开数据库
   */
  openDB() {
    return new Promise<TsIndexDB>((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, this.version);
      request.onerror = (e) => {
        reject(e);
      };
      request.onsuccess = (event: any) => {
        this.database = event.target.result;
        let task: () => void;
        while ((task = this.queue.shift() as any)) {
          task();
        }
        resolve(this);
      };
      //数据库升级
      request.onupgradeneeded = (e) => {
        this.tableList.forEach((element: DBTables) => {
          this.createTable((e.target as any).result, element);
        });
      };
    });
  }

  /**
   * @method 关闭数据库
   */
  closeDB() {
    return new Promise((resolve, reject) => {
      try {
        if (!this.database) {
          resolve('请开启数据库');
          return;
        }
        this.database!.close();
        this.database = null;
        TsIndexDB._instance = null;
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @method 删除数据库
   * @param {String} tableName - 数据库名称
   */
  deleteDB(tableName: string) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(tableName);
      request.onerror = (e) => {
        reject(e);
      };
      request.onsuccess = (e) => {
        resolve(e);
      };
    });
  }

  /**
   * @method 删除表数据
   * @param {String} tableName - 数据库名称
   */
  deleteTable(tableName: string) {
    return this.commitDB(
      tableName,
      (transaction: IDBObjectStore) => transaction.clear(),
      'readwrite',
      (_: any, resolve: () => void) => {
        resolve();
      },
    );
  }

  /**
   * 创建table
   * @options<Object>  keyPath指定主键 autoIncrement是否自增
   * @index 索引配置
   * */
  private createTable(idb: any, { tableName, options, indexs = [] }: DBTables) {
    if (!idb.objectStoreNames.contains(tableName)) {
      const store = idb.createObjectStore(tableName, options);
      for (const { key, options } of indexs) {
        store.createIndex(key, key, options);
      }
    }
  }

  /**
   * 提交DB请求
   * @param tableName - 表名
   * @param commit - 提交具体函数
   * @param mode - 事物方式
   * @param cursorFunc - 游标方法
   */
  private commitDB<T>(
    tableName: string,
    commit?: (transaction: IDBObjectStore) => IDBRequest<any>,
    mode: IDBTransactionMode = 'readwrite',
    cursorFunc?: (request: any, resolve: any, store: IDBObjectStore) => void,
  ) {
    return new Promise<T>((resolve, reject) => {
      const task = () => {
        try {
          if (this.database) {
            const store = this.database.transaction(tableName, mode).objectStore(tableName);
            if (!commit) {
              cursorFunc!(null, resolve, store);
              return;
            }
            const res = commit(store);
            res!.onsuccess = (e: any) => {
              if (cursorFunc) {
                cursorFunc(e, resolve, store);
              } else {
                resolve(e);
              }
            };
            res!.onerror = (event) => {
              reject(event);
            };
          } else {
            reject(new Error('请开启数据库'));
          }
        } catch (error) {
          reject(error);
        }
      };
      if (!this.database) {
        this.queue.push(task);
      } else {
        task();
      }
    });
  }

  /**
   * @method 游标开启成功,遍历游标
   * @param e {*}
   * @param config {Object}
   *  @property condition {Function} - 条件
   *  @property handler {Function} - 满足条件的处理方式 @arg {Object} @property cursor游标 @property currentValue当前值
   *  @property success {Function} - 游标遍历完执行的方法
   *  @return {Null}
   * */
  cursorSuccess(e: any, { condition, handler, success }: any): void {
    const cursor: IDBCursorWithValue = e.target.result;
    if (cursor) {
      const currentValue = cursor.value;
      if (condition(currentValue)) handler({ cursor, currentValue });
      cursor.continue();
    } else {
      success();
    }
  }
}
