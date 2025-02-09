import CategoryCard from '@/components/category-card/category-card';
import { Meta, StoryObj } from '@storybook/react';

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
    balance: 'outcome'
  }

} satisfies Meta<typeof CategoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    balance: undefined,
    value: 0
  }
}

export const IncomeBalance : Story = {
  args: {
    balance: 'income'
  }
}

export const OutcomeBalance: Story = {
  args: {
    balance: 'outcome'
  }
}

export const EditMode: Story = {
  args: {
    isEdit: true
  }
}
