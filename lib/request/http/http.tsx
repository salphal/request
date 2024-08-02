import React, {
  type ForwardRefRenderFunction,
  type Ref,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
} from 'react';

export interface HttpProps {}

export interface HttpRef {}

const Http: ForwardRefRenderFunction<HttpRef, HttpProps> = (
  props: HttpProps,
  ref: Ref<HttpRef | HTMLDivElement>,
) => {
  const {} = props;

  useImperativeHandle(ref, () => ({}));

  useEffect(() => {}, []);

  return (
    <React.Fragment>
      <div className={''}>Http Component</div>
    </React.Fragment>
  );
};

export default React.forwardRef(Http);
