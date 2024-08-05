import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { testRetry } from '@lib/request/http/apis/modules/test.ts';

export interface TestRetryProps {
  [key: string]: any;
}

export interface TestRetryMethods {
  [key: string]: any;
}

const TestRetry: React.FC<TestRetryProps> = (props: TestRetryProps & TestRetryMethods) => {
  const {} = props;

  const navigate = useNavigate();

  useEffect(() => {
    testRetry();
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

export default React.memo(TestRetry);
