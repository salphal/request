import type { Meta, StoryObj } from '@storybook/react';
import Socket, { type SocketProps } from './socket';
import { SocketStory } from './socket.story';

const meta = {
  title: 'Request/Socket',
  component: SocketStory,
  // tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      toc: true,
    },
  },
  args: {},
  argTypes: {},
} satisfies Meta<typeof Socket>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultProps: SocketProps = {};

export const DefaultSocket: Story = {
  args: {
    ...defaultProps,
  },
};

export const AnotherSocket: Story = {
  args: {
    ...defaultProps,
  },
};
