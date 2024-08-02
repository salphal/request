import type { Preview } from '@storybook/react';
import '../lib/global.css';

/**
 * 内容展示区全局配置
 */
const preview: Preview = {
  parameters: {
    actions: {
      // argTypesRegex: '^on[A-Z].*'
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    /**
     * 内容区布局配置
     * https://storybook.js.org/docs/api/parameters#layout
     */
    layout: 'fullscreen',
    /**
     * 开启右侧导航菜单
     * https://storybook.js.org/docs/writing-docs/autodocs#configure-the-table-of-contents
     */
    docs: {
      toc: true,
    },
    /**
     * 故事排序
     */
    options: {
      storySort: {
        order: [],
      },
    },
  },
};

export default preview;
