import { useAccounts } from '@/features/accounts/accounts.queries';

export const useAccountsController = () => {
  const {
    data: accountsData,
    isPending: isAccountsLoading,
    isError: isAccountsError,
    refetch: refetchAccounts,
  } = useAccounts();

  return {
    accountsData,
    isAccountsLoading,
    isAccountsError,
    refetchAccounts,
  };
};
