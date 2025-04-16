import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import CategoryCard from '@/components/categories/category-card';

const meta = {
  title: 'Components/CategoryCard',
  component: CategoryCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    category: 'Кафе и рестораны',
    description: 'Вечера за чашкой кофе или трапезой в любимом месте',
    value: 2000,
    type: 'expense',
    onClick: fn(),
  },
} satisfies Meta<typeof CategoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: undefined,
    value: 0,
  },
};

export const IncomeBalance: Story = {
  args: {
    type: 'income',
  },
};

export const OutcomeBalance: Story = {
  args: {
    type: 'expense',
  },
};

export const EditMode: Story = {
  args: {
    isEdit: true,
  },
};
