import { OptionType } from '@/components/base/select/option-type';
import texts from '@/features/accounts/accounts.texts';
import { AccountTransactionType } from '@/features/accounts/accounts.types';
import { ACCOUNT_TYPES, AccountType } from '@/types/enums';

export const ACCOUNTS_QUERY_PATH = '/api/accounts';
export const ACCOUNTS_QUERY_KEY = ['accounts'] as const;
export const ACCOUNTS_QUERY_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const ACCOUNT_TRANSACTIONS_QUERY_KEY = 'account_transactions';
export const TRANSACTIONS_QUERY_PATH = 'transactions';

export const ACCOUNT_OPTIONS: OptionType<AccountType>[] = ACCOUNT_TYPES.map((type, index) => ({
  title: texts.accountParams.typeTitles[index],
  value: type,
}));

export const ACCOUNT_TRANSACTION_TYPES = ['topup', 'transfer'] as const;

export const ACCOUNT_TRANSACTION_OPTIONS: OptionType<AccountTransactionType>[] =
  ACCOUNT_TRANSACTION_TYPES.map((type, index) => ({
    title: texts.accountTransaction.action.operationTypes[index],
    value: type,
  }));

export const ACCOUNT_LIMITS = {
  MAX_VALUE: 999_999_999_999.99,
  MAX_NEGATIVE_VALUE: -999_999_999_999.99,

  MIN_VALUE: 0,
  MIN_TRANSACTION: 0.01,

  MAX_TOTAL_BALANCE: 999_999_999_999_999,
  MAX_NEGATIVE_TOTAL_BALANCE: -999_999_999_999_999,
  EXCEEDED_TOTAL_BALANCE: 999_999_999_999_999.01,
  EXCEEDED_NEGATIVE_TOTAL_BALANCE: -999_999_999_999_999.01,
} as const;
