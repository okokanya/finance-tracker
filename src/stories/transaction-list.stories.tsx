import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import TransactionList from '@/components/accounts/manage-account-modal/transaction-list';

const meta = {
  title: 'Components/TransactionList',
  component: TransactionList,
  parameters: {
    layout: 'centered',
  },
  args: {
    repeatOnError: fn(),
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TransactionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    isLoading: true,
    transactions: [],
    isError: false,
  },
};

export const Error: Story = {
  args: {
    isLoading: false,
    transactions: [],
    isError: true,
  },
};

export const EmptyTransactions: Story = {
  args: {
    isLoading: false,
    transactions: [],
    isError: false,
  },
};

export const Transactions: Story = {
  args: {
    isLoading: false,
    transactions: [
      {
        id: '1',
        description: 'Перевод',
        amount: 3000,
        accountId: '1',
        targetAccountId: '2',
      },
      {
        id: '2',
        description: 'Перевод',
        amount: -5000,
        accountId: '1',
        targetAccountId: '2',
      },
      {
        id: '3',
        description: 'Перевод',
        amount: -20000,
        accountId: '1',
        targetAccountId: '2',
      },
    ],
    isError: false,
  },
};
