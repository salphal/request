import React, { useImperativeHandle, type ForwardRefRenderFunction, type Ref } from 'react';
import classNames from 'classnames';

/**
 * 不可以设置 [key: string]: any; 否则无法自动解析
 * 不可以设置 [key: string]: any; 否则无法自动解析
 * 不可以设置 [key: string]: any; 否则无法自动解析
 */
export interface ExampleProps {
  /** 文本字符串 */
  string?: string;
  /** 数字 */
  number?: number;
  /** 布尔值 */
  boolean?: boolean;
  /** 对象 */
  object?: object;
  /** 下拉单选 */
  select?: any;
  /** 下拉多选 */
  multiSelect?: any;
  /** 单选 */
  radio?: any;
  /** 单行单选 */
  inlineRadio?: any;
  /** 多选 */
  check?: any;
  /** 单行多选 */
  inlineCheck?: any;
  /** 范围选择滑块 */
  range?: any;
  /** 文件选择 */
  file?: any;
  /** 颜色选择 */
  color?: any;
  /** 日期选择 */
  date?: any;
  /** 点击事件 */
  onClick?: (e: Event) => void;
}

interface ExampleRef {
  [key: string]: any;
}

const Example: ForwardRefRenderFunction<ExampleRef, ExampleProps> = (
  props: ExampleProps,
  ref: Ref<ExampleRef | HTMLDivElement>,
) => {
  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({}));

  return (
    <React.Fragment>
      <div className={classNames(['h-100', 'p-3'])}>
        <div className={'text-xl mb-3'}>Example</div>
        <div>
          <div className={'flex flex-row flex-nowrap pl-3'}>
            -&nbsp;<div className={'w-32 mb-2'}>string:</div>
            <div>{String(props.string)}</div>
          </div>
          <div className={'flex flex-row flex-nowrap pl-3'}>
            -&nbsp;<div className={'w-32 mb-2'}>number:</div>
            <div>{String(props.number)}</div>
          </div>
          <div className={'flex flex-row flex-nowrap pl-3'}>
            -&nbsp;<div className={'w-32 mb-2'}>boolean:</div>
            <div>{String(props.boolean)}</div>
          </div>
          <div className={'flex flex-row flex-nowrap pl-3'}>
            -&nbsp;<div className={'w-32 mb-2'}>object:</div>
            <div>{String(JSON.stringify(props.object))}</div>
          </div>
          <div className={'flex flex-row flex-nowrap pl-3'}>
            -&nbsp;<div className={'w-32 mb-2'}>select:</div>
            <div>{String(props.select)}</div>
          </div>
          <div className={'flex flex-row flex-nowrap pl-3'}>
            -&nbsp;<div className={'w-32 mb-2'}>multi-select:</div>
            <div>{String(JSON.stringify(props.multiSelect))}</div>
          </div>
          <div className={'flex flex-row flex-nowrap pl-3'}>
            -&nbsp;<div className={'w-32 mb-2'}>radio:</div>
            <div>{String(props.radio)}</div>
          </div>
          <div className={'flex flex-row flex-nowrap pl-3'}>
            -&nbsp;<div className={'w-32 mb-2'}>inline-radio:</div>
            <div>{String(props.inlineRadio)}</div>
          </div>
          <div className={'flex flex-row flex-nowrap pl-3'}>
            -&nbsp;<div className={'w-32 mb-2'}>check:</div>
            <div>{String(JSON.stringify(props.check))}</div>
          </div>
          <div className={'flex flex-row flex-nowrap pl-3'}>
            -&nbsp;<div className={'w-32 mb-2'}>inlineCheck:</div>
            <div>{String(JSON.stringify(props.inlineCheck))}</div>
          </div>
          <div className={'flex flex-row flex-nowrap pl-3'}>
            -&nbsp;<div className={'w-32 mb-2'}>range:</div>
            <div>{String(props.range)}</div>
          </div>
          <div className={'flex flex-row flex-nowrap pl-3'}>
            -&nbsp;<div className={'w-32 mb-2'}>file:</div>
            <div>{String(JSON.stringify(props.file))}</div>
          </div>
          <div className={'flex flex-row flex-nowrap pl-3'}>
            -&nbsp;<div className={'w-32 mb-2'}>color:</div>
            <div>{String(props.color)}</div>
          </div>
          <div className={'flex flex-row flex-nowrap pl-3'}>
            -&nbsp;<div className={'w-32 mb-2'}>date:</div>
            <div>{String(props.date)}</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default React.forwardRef(Example);
