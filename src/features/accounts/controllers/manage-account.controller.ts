import {
  useAccountTransactions,
  useDeleteAccount,
  useUpdateAccount,
} from '@/features/accounts/accounts.queries';
import {
  useAccountFormData,
  useAccountsStoreActions,
  useAccountToManage,
  useIsManageAccountModalOpen,
  useIsRepeatArchiveAccountModalOpen,
  useIsRepeatDeleteAccountModalOpen,
  useIsRepeatUpdateAccountModalOpen,
} from '@/features/accounts/accounts.store';
import { AccountFormSuccessResult, AccountResponse } from '@/features/accounts/accounts.types';

export const useManageAccountController = () => {
  const {
    setManageAccountModalOpen,
    setAccountToManage,
    setAccountFormData,
    setRepeatUpdateAccountModalOpen,
    setRepeatDeleteAccountModalOpen,
    setRepeatArchiveAccountModalOpen,
  } = useAccountsStoreActions();

  const isManageAccountModalOpen = useIsManageAccountModalOpen();
  const accountToManage = useAccountToManage();
  const { mutate: mutateUpdateAccount, isPending: isUpdateAccountLoading } = useUpdateAccount();

  const {
    data: transactions,
    isPending: isLoadingTransactions,
    isError: isTransactionsError,
    refetch: refetchTransactions,
  } = useAccountTransactions(accountToManage?.id);

  const { mutate: mutateDeleteAccount, isPending: isDeleteAccountLoading } = useDeleteAccount();

  const accountFormData = useAccountFormData();

  const isRepeatArchiveAccountModalOpen = useIsRepeatArchiveAccountModalOpen();
  const isRepeatDeleteAccountModalOpen = useIsRepeatDeleteAccountModalOpen();
  const isRepeatUpdateAccountModalOpen = useIsRepeatUpdateAccountModalOpen();

  const onManageAccountClicked = (account: AccountResponse) => {
    setAccountToManage(account);
    setManageAccountModalOpen(true);
  };

  const hasAccountDataChanged = (
    currentAccount: AccountResponse,
    formData: AccountFormSuccessResult
  ): boolean => {
    return (
      currentAccount.name !== formData.name ||
      currentAccount.type !== formData.type ||
      currentAccount.balance !== formData.balance ||
      (formData.description?.trim() !== '' && currentAccount.description !== formData.description)
    );
  };

  const onUpdateAccount = (data: AccountFormSuccessResult) => {
    setManageAccountModalOpen(false);

    if (!accountToManage) return;

    mutateUpdateAccount(
      { id: accountToManage.id, ...data },
      {
        onSuccess: () => {
          setAccountToManage(null);
          setAccountFormData(null);
        },
        onError: () => {
          setRepeatUpdateAccountModalOpen(true);
          setAccountFormData(data);
        },
      }
    );
  };

  const onCloseManageAccountModal = () => {
    setManageAccountModalOpen(false);
    setAccountToManage(null);
  };

  const onDeleteAccount = () => {
    setManageAccountModalOpen(false);

    if (!accountToManage) return;

    mutateDeleteAccount(accountToManage.id, {
      onSuccess: () => {
        setAccountToManage(null);
      },
      onError: () => {
        setRepeatDeleteAccountModalOpen(true);
      },
    });
  };

  const onArchiveAccount = () => {
    setManageAccountModalOpen(false);

    if (!accountToManage) return;

    mutateUpdateAccount(
      {
        ...accountToManage,
        isArchived: true,
      },
      {
        onSuccess: () => {
          setAccountToManage(null);
        },
        onError: () => {
          setRepeatArchiveAccountModalOpen(true);
        },
      }
    );
  };

  const onRepeatUpdateAccount = () => {
    setRepeatUpdateAccountModalOpen(false);

    if (accountFormData) {
      onUpdateAccount(accountFormData);
    }
  };

  const onRepeatDeleteAccount = () => {
    setRepeatDeleteAccountModalOpen(false);
    onDeleteAccount();
  };

  const onRepeatArchiveAccount = () => {
    setRepeatArchiveAccountModalOpen(false);
    onArchiveAccount();
  };

  const onCloseRepeatUpdateAccountModal = () => {
    setRepeatUpdateAccountModalOpen(false);
    setAccountToManage(null);
    setAccountFormData(null);
  };

  const onCloseRepeatDeleteAccountModal = () => {
    setRepeatDeleteAccountModalOpen(false);
    setAccountToManage(null);
  };

  const onCloseRepeatArchiveAccountModal = () => {
    setRepeatArchiveAccountModalOpen(false);
    setAccountToManage(null);
  };

  return {
    isUpdateAccountLoading: isUpdateAccountLoading || isDeleteAccountLoading,
    isManageAccountModalOpen,
    onManageAccountClicked,
    hasAccountDataChanged,
    accountToManage,
    onUpdateAccount,
    onCloseManageAccountModal,
    transactions,
    isLoadingTransactions,
    isTransactionsError,
    refetchTransactions,
    onDeleteAccount,
    onArchiveAccount,
    isRepeatUpdateAccountModalOpen,
    onRepeatUpdateAccount,
    onCloseRepeatUpdateAccountModal,
    isRepeatDeleteAccountModalOpen,
    onRepeatDeleteAccount,
    onCloseRepeatDeleteAccountModal,
    isRepeatArchiveAccountModalOpen,
    onRepeatArchiveAccount,
    onCloseRepeatArchiveAccountModal,
  };
};
