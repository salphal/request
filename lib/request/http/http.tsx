import React, {
  type ForwardRefRenderFunction,
  type Ref,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
} from 'react';
import { testCache } from '@lib/request/http/apis/modules/test.ts';

export interface HttpProps {}

export interface HttpRef {}

const Http: ForwardRefRenderFunction<HttpRef, HttpProps> = (
  props: HttpProps,
  ref: Ref<HttpRef | HTMLDivElement>,
) => {
  const {} = props;

  useImperativeHandle(ref, () => ({}));

  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    testCache()
      .then(res => {
        console.log('=>(test-cache.tsx:25) testCache.res', res);
      });
  }, [refreshCount]);

  return (
    <React.Fragment>
      <div className={''}>
        <button onClick={() => {setRefreshCount(p => ++p)}}>refresh</button>
      </div>
    </React.Fragment>
  );
};

export default React.forwardRef(Http);
