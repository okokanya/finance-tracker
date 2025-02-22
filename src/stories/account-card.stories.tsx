import type { Meta, StoryObj } from '@storybook/react';

import AccountCard from '@/components/accounts/account-card/account-card';

const meta = {
  title: 'Components/AccountCard',
  component: AccountCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AccountCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Regular: Story = {
  args: {
    account: {
      name: 'Основной счёт',
      description: 'Обычный',
      balance: 10500.55,
      type: 'regular',
    }
  },
};

export const RegularWithoutDescription: Story = {
  args: {
    account: {
      name: 'Основной счёт',
      description: null,
      balance: 10500.55,
      type: 'regular',
    }
  },
};

export const Savings: Story = {
  args: {
    account: {
      name: 'Сбережения',
      description: 'Накопительный',
      balance: 50000.75,
      type: 'savings',
    }
  },
};

export const DebtIOwe: Story = {
  args: {
    account: {
      name: 'Автокредит',
      description: 'Долговой; я должен',
      balance: -200000.00,
      type: 'debt_i_owe',
    },
  },
};

export const DebtTheyOwe: Story = {
  args: {
    account: {
      name: 'Долг Ивана',
      description: 'Долговой; мне должны',
      balance: 15000.00,
      type: 'debt_they_owe',
    },
  },
};
