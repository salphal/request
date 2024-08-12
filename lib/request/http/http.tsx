import React, {
  type ForwardRefRenderFunction,
  type Ref,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
} from 'react';
import { testLoading, testPending, testRetry } from '@lib/request/http/apis/modules/test.ts';
import type { CacheType } from '@lib/request/http/types/cache-store';
import { Button } from 'antd';
import ConsolePreview from '@lib/components/console-preview';

export interface HttpProps {
  ignoreLoading?: boolean;
  setLoading?: (loading: boolean) => any;
  loadingType?: 'single' | 'multi';

  abortAble?: boolean;

  retryAble?: boolean;
  retryDelay?: number;
  retryCount?: number;
  retryMaxCount?: number;

  cacheAble?: boolean;
  validityPeriod?: number;
  cacheType?: CacheType;
}

export interface HttpRef {}

const Http: ForwardRefRenderFunction<HttpRef, HttpProps> = (
  props: HttpProps,
  ref: Ref<HttpRef | HTMLDivElement>,
) => {
  const {} = props;

  useImperativeHandle(ref, () => ({}));

  const [refreshCount, setRefreshCount] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    testLoading({ setLoading: updateLoading });

    // testPending()
    //   .then((res) => {
    //     console.log('=>(http.tsx:34) res', res);
    //   })
    //   .catch((err) => {
    //     console.log('=>(http.tsx:36) err', err);
    //   })
    //   .finally(() => {});

    // testPending();
    // testPending();

    testRetry();
  }, [refreshCount]);

  const updateLoading = (loading: boolean) => {
    setLoading(loading);
    return loading;
  };

  return (
    <React.Fragment>
      <div className={''}>
        {/*loading: {String(loading)} <br />*/}
        {/*<button*/}
        {/*  className={'border rounded-2xl py-1 px-3'}*/}
        {/*  onClick={() => {*/}
        {/*    setRefreshCount((p) => ++p);*/}
        {/*  }}*/}
        {/*>*/}
        {/*  refresh*/}
        {/*</button>*/}
        {props.abortAble && (
          <>
            abortAble
            <Button type="primary">Test</Button>
          </>
        )}
        {props.retryAble && <>retryAble</>}
        {props.cacheAble && <>cacheAble</>}
        <ConsolePreview />
      </div>
    </React.Fragment>
  );
};

export default React.forwardRef(Http);
