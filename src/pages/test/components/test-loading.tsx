import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { testLoading } from '@lib/request/http/apis/modules/test.ts';

export interface TestLoadingProps {
  [key: string]: any;
}

export interface TestLoadingMethods {
  [key: string]: any;
}

const TestLoading: React.FC<TestLoadingProps> = (props: TestLoadingProps & TestLoadingMethods) => {
  const {} = props;

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    testLoading({
      setLoading: updateLoading,
    })
      .then((res) => {
        console.log('=>(test-loading.tsx:28) res1', res);
      })
      .catch((err) => {});
    testLoading({
      setLoading: updateLoading,
    })
      .then((res) => {
        console.log('=>(test-loading.tsx:28) res2', res);
      })
      .catch((err) => {});
    testLoading({
      setLoading: updateLoading,
    })
      .then((res) => {
        console.log('=>(test-loading.tsx:28) res3', res);
      })
      .catch((err) => {});
  }, []);

  const updateLoading = (loading: boolean) => {
    console.log('=>(test-loading.tsx:41) updateLoading', loading);
    setLoading(loading);
  };

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

export default React.memo(TestLoading);
