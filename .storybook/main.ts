import type { StorybookConfig } from '@storybook/react-vite';
import { withoutVitePlugins } from '@storybook/builder-vite';

const config: StorybookConfig = {
  /** stories 文件范围 */
  stories: ['../lib/**/*.mdx', '../lib/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-actions',
    '@chromatic-com/storybook',
    '@storybook/addon-actions/register',
    '@storybook/addon-storysource',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {
      legacyRootApi: true,
    },
  },

  docs: {},

  viteFinal: async (config) => ({
    ...config,
    plugins: await withoutVitePlugins(config.plugins, ['vite:dts']), // skip dts plugin
  }),

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};
export default config;
