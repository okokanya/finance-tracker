import { useAddAccount } from '@/features/accounts/accounts.queries';
import {
  useAccountsStoreActions,
  useAccountToAdd,
  useIsAddModalOpen,
  useIsRepeatAddModalOpen,
} from '@/features/accounts/accounts.store';
import { AccountFormSuccessResult } from '@/features/accounts/accounts.types';

export const useAddAccountController = () => {
  const isAddModalOpen = useIsAddModalOpen();
  const isRepeatAddModalOpen = useIsRepeatAddModalOpen();
  const accountToAdd = useAccountToAdd();
  const { setAddModalOpen, setRepeatAddModalOpen, setAccountToAdd } = useAccountsStoreActions();
  const { mutate: mutateAddAccount, isPending: isAddAccountLoading } = useAddAccount();

  const onAddFormSuccess = (data: AccountFormSuccessResult) => {
    mutateAddAccount(data, {
      onSuccess: () => {
        setAccountToAdd(null);
      },
      onError: () => {
        setRepeatAddModalOpen(true);
        setAccountToAdd(data);
      },
    });
  };

  const onRepeatAddFormSuccess = () => {
    if (accountToAdd) onAddFormSuccess(accountToAdd);
  };

  const onCloseRepeatAddModal = () => {
    setRepeatAddModalOpen(false);
    setAccountToAdd(null);
  };

  return {
    isAddAccountLoading,
    isAddModalOpen,
    setAddModalOpen,
    onAddFormSuccess,
    isRepeatAddModalOpen,
    onRepeatAddFormSuccess,
    onCloseRepeatAddModal,
  };
};
