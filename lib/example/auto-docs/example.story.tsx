import React from 'react';
import type { ExampleProps } from '@lib/example/auto-docs/example.tsx';
import Example from './example.tsx';

export interface ExampleStoryProps {}

/**
 * 设置属性默认值
 */
export const ExampleStory = React.forwardRef<any, ExampleStoryProps & ExampleProps>(
  (
    {
      string = '',
      number = 0,
      boolean = false,
      object = {},
      select = '',
      multiSelect = [],
      radio = '',
      inlineRadio = '',
      check = [],
      inlineCheck = [],
      range = 15,
      color = '#fff',
      file = {},
      date = new Date().valueOf(),
      onClick = () => {},
      ...rest
    },
    ref,
  ) => {
    const props = {
      string,
      number,
      boolean,
      object,
      select,
      multiSelect,
      radio,
      inlineRadio,
      check,
      inlineCheck,
      range,
      color,
      file,
      date,
      ...rest,
    };
    return (
      <div className={'story-wrap h-100'}>
        <Example
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

/** 名称必须保持一致, 否则无法自动解析 */
ExampleStory.displayName = 'ExampleStory';

export default React.memo(ExampleStory);
