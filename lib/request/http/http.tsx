import React, {
  type ForwardRefRenderFunction,
  type Ref,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
} from 'react';
import { testRequest } from '@lib/request/http/apis/modules/test.ts';

export interface HttpProps {}

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
    testRequest({ setLoading: updateLoading });
  }, [refreshCount]);

  const updateLoading = (loading: boolean) => {
    console.log('=>(http.tsx:34) loading', loading);
    setLoading(loading);
    return loading;
  };

  return (
    <React.Fragment>
      <div className={''}>
        loading: {String(loading)} <br />
        <button
          onClick={() => {
            setRefreshCount((p) => ++p);
          }}
        >
          refresh
        </button>
      </div>
    </React.Fragment>
  );
};

export default React.forwardRef(Http);
