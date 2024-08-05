import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { testPending } from '@lib/request/http/apis/modules/test.ts';

export interface TestPendingProps {
  [key: string]: any;
}

export interface TestPendingMethods {
  [key: string]: any;
}

const TestPending: React.FC<TestPendingProps> = (props: TestPendingProps & TestPendingMethods) => {
  const {} = props;

  const navigate = useNavigate();

  useEffect(() => {
    testPending()
      .then((res) => {
        console.log('=>(test-pending.tsx:24) res', res);
      })
      .catch((err) => {});
    testPending()
      .then((res) => {
        console.log('=>(test-pending.tsx:24) res', res);
      })
      .catch((err) => {});
    testPending()
      .then((res) => {
        console.log('=>(test-pending.tsx:24) res', res);
      })
      .catch((err) => {});
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

export default React.memo(TestPending);
