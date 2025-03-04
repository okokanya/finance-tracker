import { useAddAccount } from '@/features/accounts/accounts.queries';
import {
  useAccountFormData,
  useAccountsStoreActions,
  useIsAddAccountModalOpen,
  useIsRepeatAddAccountModalOpen,
} from '@/features/accounts/accounts.store';
import { AccountFormSuccessResult } from '@/features/accounts/accounts.types';

export const useAddAccountController = () => {
  const isAddAccountModalOpen = useIsAddAccountModalOpen();
  const isRepeatAddAccountModalOpen = useIsRepeatAddAccountModalOpen();
  const accountFormData = useAccountFormData();
  const { setAddAccountModalOpen, setRepeatAddAccountModalOpen, setAccountFormData } =
    useAccountsStoreActions();
  const { mutate: mutateAddAccount, isPending: isAddAccountLoading } = useAddAccount();

  const onAddAccount = (data: AccountFormSuccessResult) => {
    mutateAddAccount(data, {
      onSuccess: () => {
        setAccountFormData(null);
      },
      onError: () => {
        setRepeatAddAccountModalOpen(true);
        setAccountFormData(data);
      },
    });
  };

  const onRepeatAddAccount = () => {
    setRepeatAddAccountModalOpen(false);

    if (accountFormData) onAddAccount(accountFormData);
  };

  const onCloseRepeatAddAccountModal = () => {
    setRepeatAddAccountModalOpen(false);
    setAccountFormData(null);
  };

  return {
    isAddAccountLoading,
    isAddAccountModalOpen,
    setAddAccountModalOpen,
    onAddAccount,
    isRepeatAddAccountModalOpen,
    onRepeatAddAccount,
    onCloseRepeatAddAccountModal,
  };
};
