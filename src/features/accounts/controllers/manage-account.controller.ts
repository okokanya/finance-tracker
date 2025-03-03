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
import { AccountFormSuccessResult } from '@/features/accounts/accounts.types';
import { Account } from '@/models';

export const useManageAccountController = () => {
  const {
    setManageAccountModalOpen: setManageModalOpen,
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

  const onManageAccountClicked = (account: Account) => {
    setAccountToManage(account);
    setManageModalOpen(true);
  };

  const onUpdateAccount = (data: AccountFormSuccessResult) => {
    setManageModalOpen(false);

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
    setManageModalOpen(false);
    setAccountToManage(null);
  };

  const onDeleteAccount = () => {
    setManageModalOpen(false);

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
    setManageModalOpen(false);

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
