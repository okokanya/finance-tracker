import { OptionType } from '@/components/select/option-type';
import texts from '@/features/accounts/accounts.texts';
import { ACCOUNT_TYPES, AccountType } from '@/types/enums';

export const ACCOUNTS_QUERY_PATH = '/api/accounts';
export const ACCOUNTS_QUERY_KEY = ['accounts'] as const;
export const ACCOUNTS_QUERY_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const ACCOUNT_OPTIONS: OptionType<AccountType>[] = ACCOUNT_TYPES.map((type, index) => ({
  title: texts.accountParams.typeTitles[index],
  value: type,
}));
