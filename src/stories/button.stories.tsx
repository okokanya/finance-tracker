import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import Button from '@/components/button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onClick: fn(),
    children: 'Button Text',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Error: Story = {
    args: {
      variant: 'error',
    },
};

export const Warning: Story = {
    args: {
      variant: 'warning',
    },
};

export const DisabledPrimary: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledSecondary: Story = {
  args: {
    variant: 'secondary',
    disabled: true,
  },
};

export const DisabledError: Story = {
    args: {
      variant: 'error',
      disabled: true,
    },
};

export const DisabledWarning: Story = {
    args: {
      variant: 'warning',
      disabled: true,
    },
};
