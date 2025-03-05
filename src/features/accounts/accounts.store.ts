import { create } from 'zustand';

import { AccountFormSuccessResult } from '@/features/accounts/accounts.types';
import { Account } from '@/models';

interface AccountsStore {
  isAddAccountModalOpen: boolean;
  isRepeatAddAccountModalOpen: boolean;
  accountFormData: AccountFormSuccessResult | null;

  isManageAccountModalOpen: boolean;
  accountToManage: Account | null;
  isRepeatUpdateAccountModalOpen: boolean;
  isRepeatDeleteAccountModalOpen: boolean;
  isRepeatArchiveAccountModalOpen: boolean;

  actions: AccountsAction;
}

interface AccountsAction {
  setAddAccountModalOpen: (isOpen: boolean) => void;
  setRepeatAddAccountModalOpen: (isOpen: boolean) => void;
  setAccountFormData: (account: AccountFormSuccessResult | null) => void;

  setManageAccountModalOpen: (isOpen: boolean) => void;
  setAccountToManage: (account: Account | null) => void;
  setRepeatUpdateAccountModalOpen: (isOpen: boolean) => void;
  setRepeatDeleteAccountModalOpen: (isOpen: boolean) => void;
  setRepeatArchiveAccountModalOpen: (isOpen: boolean) => void;
}

const useAccountStore = create<AccountsStore>(set => ({
  isAddAccountModalOpen: false,
  isRepeatAddAccountModalOpen: false,
  accountFormData: null,
  isManageAccountModalOpen: false,
  accountToManage: null,
  isRepeatUpdateAccountModalOpen: false,
  isRepeatDeleteAccountModalOpen: false,
  isRepeatArchiveAccountModalOpen: false,
  actions: {
    setAddAccountModalOpen: isOpen => set({ isAddAccountModalOpen: isOpen }),
    setRepeatAddAccountModalOpen: isOpen => set({ isRepeatAddAccountModalOpen: isOpen }),
    setAccountFormData: account => set({ accountFormData: account }),

    setManageAccountModalOpen: isOpen => set({ isManageAccountModalOpen: isOpen }),
    setAccountToManage: account => set({ accountToManage: account }),
    setRepeatUpdateAccountModalOpen: isOpen => set({ isRepeatUpdateAccountModalOpen: isOpen }),
    setRepeatDeleteAccountModalOpen: isOpen => set({ isRepeatDeleteAccountModalOpen: isOpen }),
    setRepeatArchiveAccountModalOpen: isOpen => set({ isRepeatArchiveAccountModalOpen: isOpen }),
  },
}));

export const useIsAddAccountModalOpen = () => useAccountStore(state => state.isAddAccountModalOpen);

export const useIsRepeatAddAccountModalOpen = () =>
  useAccountStore(state => state.isRepeatAddAccountModalOpen);

export const useAccountFormData = () => useAccountStore(state => state.accountFormData);

export const useIsManageAccountModalOpen = () =>
  useAccountStore(state => state.isManageAccountModalOpen);

export const useAccountToManage = () => useAccountStore(state => state.accountToManage);

export const useIsRepeatUpdateAccountModalOpen = () =>
  useAccountStore(state => state.isRepeatUpdateAccountModalOpen);

export const useIsRepeatDeleteAccountModalOpen = () =>
  useAccountStore(state => state.isRepeatDeleteAccountModalOpen);

export const useIsRepeatArchiveAccountModalOpen = () =>
  useAccountStore(state => state.isRepeatArchiveAccountModalOpen);

export const useAccountsStoreActions = () => useAccountStore(state => state.actions);
