import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import AccountCard from '@/components/accounts/account-card';

const meta = {
  title: 'Components/AccountCard',
  component: AccountCard,
  parameters: {
    layout: 'centered',
  },
  args: {
    onAddTransactionClick: fn(),
    onManageClick: fn(),
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AccountCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Regular: Story = {
  args: {
    account: {
      id: '1',
      name: 'Основной счёт',
      description: 'Обычный',
      balance: 10500.55,
      displayBalance: 10500.55,
      type: 'regular',
      isArchived: false,
    },
  },
};

export const RegularWithoutDescription: Story = {
  args: {
    account: {
      id: '2',
      name: 'Основной счёт',
      description: null,
      balance: 10500.55,
      displayBalance: 10500.55,
      type: 'regular',
      isArchived: false,
    },
  },
};

export const Savings: Story = {
  args: {
    account: {
      id: '2',
      name: 'Сбережения',
      description: 'Накопительный',
      balance: 50000.75,
      displayBalance: 50000.75,
      type: 'savings',
      isArchived: false,
    },
  },
};

export const DebtIOwe: Story = {
  args: {
    account: {
      id: '4',
      name: 'Автокредит',
      description: 'Долговой; я должен',
      balance: 200000.0,
      displayBalance: -200000.0,
      type: 'debt_i_owe',
      isArchived: false,
    },
  },
};

export const DebtTheyOwe: Story = {
  args: {
    account: {
      id: '5',
      name: 'Долг Ивана',
      description: 'Долговой; мне должны',
      balance: 15000.0,
      displayBalance: 15000.0,
      type: 'debt_they_owe',
      isArchived: false,
    },
  },
};
