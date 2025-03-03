import { AccountFormSuccessResult } from '@/features/accounts/accounts.types';
import { Account } from '@/models';

export const hasAccountChanges = (
  currentAccount: Account,
  formData: AccountFormSuccessResult
): boolean => {
  return (
    currentAccount.name !== formData.name ||
    currentAccount.type !== formData.type ||
    currentAccount.balance !== formData.balance ||
    (formData.description?.trim() !== '' && currentAccount.description !== formData.description)
  );
};
