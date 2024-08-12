import type { Meta, StoryObj } from '@storybook/react';
import ConsolePreview, { type ConsolePreviewProps } from "./console-preview";
import { ConsolePreviewStory } from './console-preview.story';


const meta = {
  title: 'Components/ConsolePreview',
  component: ConsolePreviewStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      toc: true,
    },
  },
  args: {
  },
  argTypes: {
  },
} satisfies Meta<typeof ConsolePreview>;


export default meta;
type Story = StoryObj<typeof meta>;


const defaultProps: ConsolePreviewProps = {
};

export const DefaultConsolePreview: Story = {
  args: {
    ...defaultProps
  }
};

export const AnotherConsolePreview: Story = {
  args: {
    ...defaultProps
  }
};
