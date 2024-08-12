import type { Meta, StoryObj } from '@storybook/react';
import Http, { type HttpProps } from './http';
import { HttpStory } from './http.story';

const meta = {
  title: 'Request/Http',
  component: HttpStory,
  // tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      toc: true,
    },
  },
  args: {
    ignoreLoading: false,
    setLoading: (loading: boolean) => loading,
    loadingType: 'single',

    abortAble: false,

    retryAble: false,
    retryDelay: 1000,
    retryCount: 0,
    retryMaxCount: 3,

    cacheAble: false,
    validityPeriod: 86400 * 3,
  },
  argTypes: {
    setLoading: {
      type: 'function',
      description: '设置 loading 的回调',
    },
    ignoreLoading: {
      type: 'boolean',
      control: {
        type: 'boolean',
      },
      description: '是否调用 config.setLoading 回调',
    },
    loadingType: {
      type: 'string',
      control: {
        type: 'inline-radio',
      },
      options: ['single', 'multi'],
      description: '单个请求 或 批量请求',
    },

    abortAble: {
      type: 'boolean',
      control: {
        type: 'boolean',
      },
      description: '是否取消重复请求',
    },

    retryAble: {
      type: 'boolean',
      control: {
        type: 'boolean',
      },
      description: '是否重试',
    },
    retryDelay: {
      type: 'number',
      control: {
        type: 'number',
      },
      description: '重试间隔',
    },
    retryMaxCount: {
      type: 'number',
      control: {
        type: 'number',
      },
      description: '重试次数',
    },

    cacheAble: {
      type: 'boolean',
      control: {
        type: 'boolean',
      },
      description: '是否缓存',
    },
    validityPeriod: {
      type: 'number',
      control: {
        type: 'number',
      },
      description: '缓存有效期( ms )',
    },
  },
} satisfies Meta<typeof Http>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultProps: HttpProps = {
  ignoreLoading: false,
  setLoading: (loading: boolean) => loading,
  loadingType: 'single',

  abortAble: false,

  retryAble: false,
  retryDelay: 1000,
  retryCount: 0,
  retryMaxCount: 3,

  cacheAble: false,
  validityPeriod: 86400 * 3,
};

export const DefaultHttp: Story = {
  args: {
    ...defaultProps,
  },
};

export const LoadingInterceptor: Story = {
  args: {
    ignoreLoading: true,
    setLoading: (loading: boolean) => loading,
    loadingType: 'single',
  },
};

export const PendingInterceptor: Story = {
  args: {
    abortAble: true,
  },
};

export const RetryInterceptor: Story = {
  args: {
    retryAble: true,
    retryDelay: 86400 * 3,
    retryMaxCount: 3,
  },
};

export const CacheInterceptor: Story = {
  args: {
    cacheAble: true,
    validityPeriod: 86400 * 3,
  },
};
