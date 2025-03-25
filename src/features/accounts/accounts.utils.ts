import { AccountType } from '@/models';

export const getChangeAccountBalanceOperator = (accountType: AccountType, isDecrease: boolean) => {
  return accountType === 'debt_i_owe' ? (isDecrease ? '+' : '-') : isDecrease ? '-' : '+';
};
