import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';

export interface TestProps {
  [key: string]: any;
}

export interface TestMethods {
  [key: string]: any;
}

const Test: React.FC<TestProps> = (props: TestProps & TestMethods) => {
  const navigate = useNavigate();

  useEffect(() => {}, []);

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
