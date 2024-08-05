import type { Preview } from '@storybook/react';
import '../lib/global.css';
import { withConsole } from '@storybook/addon-console';
import { setConsoleOptions } from '@storybook/addon-console';

const panelExclude = setConsoleOptions({}).panelExclude;
setConsoleOptions({
  panelExclude: [...panelExclude, /deprecated/],
});

/**
 * 内容展示区全局配置
 */
const preview: Preview = {
  decorators: [(storyFn, context) => withConsole()(storyFn)(context)],
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
