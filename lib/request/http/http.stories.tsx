import type { Meta, StoryObj } from '@storybook/react';
import Http, { type HttpProps } from './http';
import { HttpStory } from './http.story';

const meta = {
  title: 'Components/Http',
  component: HttpStory,
  // tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      toc: true,
    },
  },
  args: {},
  argTypes: {},
} satisfies Meta<typeof Http>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultProps: HttpProps = {};

export const DefaultHttp: Story = {
  args: {
    ...defaultProps,
  },
};

export const AnotherHttp: Story = {
  args: {
    ...defaultProps,
  },
};
