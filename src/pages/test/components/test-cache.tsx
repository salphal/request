import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { testCache } from '@lib/request/http/apis/modules/test.ts';

export interface TestCacheProps {
  [key: string]: any;
}

export interface TestCacheMethods {
  [key: string]: any;
}

const TestCache: React.FC<TestCacheProps> = (props: TestCacheProps & TestCacheMethods) => {
  const {} = props;

  const navigate = useNavigate();

  useEffect(() => {
    testCache().then((res) => {
      console.log('=>(test-cache.tsx:25) testCache.res', res);
    });
  }, []);

  const buttonOnClick = (path: string) => {
    navigate(path);
  };

  return (
    <React.Fragment>
      <div className={'wrap'}>
        <div className={'content'}>
          <button
            className={'button'}
            onClick={() => buttonOnClick('/test')}
          >
            back
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default React.memo(TestCache);
