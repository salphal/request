import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Example, { ExampleProps } from './example';
import { ExampleStory } from './example.story';

/**
 * 自定义 example.doc.mdx
 */

const meta = {
  /**
   * 标题( 可通过 / 分组 )
   */
  title: 'Example/CustomDocs',
  /**
   * 组件
   */
  component: ExampleStory,
  /**
   * tags: https://storybook.js.org/docs/writing-stories/tags
   *  - autodocs: 自动生成文档
   *  - dev: 过滤 带有 tags.dev 的开发组件
   *  - test: 过滤 带有 tags.test 的测试组件
   *
   * autodocs: https://storybook.js.org/docs/writing-docs/autodocs
   *  - 暴露的 interface 上不能使用 [key: string]: any, 否则无法自动解析
   *  - 默认值设置必须在 函数的第一个参数上解构 props, 并为某个属性设置默认值, 否则无法解析
   */
  // tags: ['autodocs'],
  /**
   * 设置 stories preview 的该如何展示
   *  - 全局配置: .storybook > preview.ts
   * https://storybook.js.org/docs/writing-stories/parameters
   */
  parameters: {},
  /**
   * 普通参数
   * 优先级: Story.args > Comp.args > Global.args
   */
  args: {
    /**
     * https://storybook.js.org/docs/essentials/actions#action-args
     */
    onClick: fn(),
  },
  /**
   * 受控参数
   *  - text: 文本输入
   *  - select: 下啦选项
   *  - boolean: 开关
   *  - radio: 单选
   * https://storybook.js.org/docs/api/arg-types#controltype
   */
  argTypes: {
    func: {
      type: 'function',
      description: '',
    },

    string: {
      type: 'string',
      control: {
        type: 'text',
      },
      description: '',
    },
    number: {
      type: 'number',
      control: {
        type: 'number',
      },
      description: '',
    },
    boolean: {
      type: 'boolean',
      control: {
        type: 'boolean',
      },
      description: '',
    },
    object: {
      type: 'object',
      control: {
        type: 'object',
      },
      description: '',
    },

    select: {
      type: 'string',
      control: {
        type: 'select',
      },
      options: ['option1', 'option2', 'option3'],
    },
    multiSelect: {
      type: 'string',
      control: {
        type: 'multi-select',
      },
      options: ['option1', 'option2', 'option3'],
    },
    radio: {
      type: 'string',
      control: {
        type: 'radio',
      },
      options: ['option1', 'option2', 'option3'],
    },
    inlineRadio: {
      type: 'string',
      control: {
        type: 'inline-radio',
      },
      options: ['option1', 'option2', 'option3'],
    },
    check: {
      type: 'string',
      control: {
        type: 'check',
      },
      options: ['option1', 'option2', 'option3'],
    },
    inlineCheck: {
      type: 'string',
      control: {
        type: 'inline-check',
      },
      options: ['option1', 'option2', 'option3'],
    },

    range: {
      type: 'range',
      control: {
        type: 'range',
        min: 1,
        max: 30,
        step: 1,
      },
    },
    file: {
      type: 'file',
      control: {
        type: 'file',
      },
    },
    color: {
      type: 'color',
      control: {
        type: 'color',
      },
    },
    date: {
      type: 'date',
      control: {
        type: 'date',
      },
    },
  },
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 设置属性初始值
 */
const defaultProps: ExampleProps = {
  string: 'hello world',
  number: 0,
  boolean: false,
  object: {},
  select: 'option2',
  multiSelect: ['option1', 'option2'],
  radio: 'option2',
  inlineRadio: 'option2',
  check: ['option2', 'option3'],
  inlineCheck: ['option1', 'option2'],
  range: 15,
  color: '#fff',
  file: {},
  date: new Date().valueOf(),
  onClick: () => {},
};

/**
 * 创建不同参数的示例
 */
export const DefaultExample: Story = {
  args: {
    ...defaultProps,
  },
};

/**
 * 创建不同参数的示例
 */
export const AnotherExample: Story = {
  args: {
    ...defaultProps,
  },
};
