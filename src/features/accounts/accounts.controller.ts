import { useAccounts } from './accounts.queries';
import { useAccountsStoreActions, useIsAddModalOpen } from './accounts.store';

export const useAccountsController = () => {
  const { data: accountsData, isLoading: isAccountsLoading, error: accountsError } = useAccounts();
  const isAddModalOpen = useIsAddModalOpen();
  const { setAddModalOpen } = useAccountsStoreActions();

  return {
    accountsData: accountsData,
    isLoading: isAccountsLoading,
    error: accountsError,
    isAddModalOpen,
    setAddModalOpen,
  };
};
