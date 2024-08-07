import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';
import { TsIndexDB } from '@lib/request/http/utils/indexdb';
import IndexDBStore from '@lib/request/http/utils/cache-store/indexdb-store';

export interface TestProps {
  [key: string]: any;
}

export interface TestMethods {
  [key: string]: any;
}

const Test: React.FC<TestProps> = (props: TestProps & TestMethods) => {
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(1111);
    // const db = new IndexDBStore();
    // db.addCache({
    //   token: 'get&/request/test_cache',
    //   startTime: new Date().getTime(),
    //   validityPeriod: 1000,
    //   data: {
    //     data: {},
    //   },
    // }).then((res) => {
    //   console.log('=>(test.tsx:30) addCache.res', res);
    // });
    // db.getCache('token').then((res) => {
    //   console.log('=>(test.tsx:34) getCache.res', res);
    // });
    // // db.removeCache('token').then((res) => {
    // //   console.log('=>(test.tsx:35) res', res);
    // // });
    // console.log(222);
  }, []);

  const [refreshCount, setRefreshCount] = useState(0);

  const buttonOnClick = (path: string) => {
    navigate(path);
  };

  return (
    <React.Fragment>
      <div className={'wrap'}>
        <div className={'content'}>
          <button
            className={'button'}
            onClick={() => buttonOnClick('/test/test-loading')}
          >
            test-loading
          </button>
          <button
            className={'button'}
            onClick={() => buttonOnClick('/test/test-pending')}
          >
            test-pending
          </button>
          <button
            className={'button'}
            onClick={() => buttonOnClick('/test/test-retry')}
          >
            test-retry
          </button>
          <button
            className={'button'}
            onClick={() => buttonOnClick('/test/test-cache')}
          >
            test-cache
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default React.memo(Test);
