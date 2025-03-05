import type { Meta, StoryObj } from '@storybook/react';

import TotalBalance from '@/components/accounts/total-balance/total-balance';

const meta = {
  title: 'Components/TotalBalance',
  component: TotalBalance,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TotalBalance>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Positive: Story = {
  args: {
    amount: 10500.55,
  },
};

export const Negative: Story = {
  args: {
    amount: -200000.0,
  },
};

export const Zero: Story = {
  args: {
    amount: 0.0,
  },
};
