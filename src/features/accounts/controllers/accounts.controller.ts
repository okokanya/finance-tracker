import { useAccounts } from '@/features/accounts/accounts.queries';

export const useAccountsController = () => {
  const { data: accountsData, isPending: isAccountsLoading, error: accountsError } = useAccounts();

  return {
    accountsData,
    isAccountsLoading,
    accountsError,
  };
};
