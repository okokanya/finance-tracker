import { create } from 'zustand';

import { AccountFormSuccessResult } from '@/features/accounts/accounts.types';

interface AccountsStore {
  isAddModalOpen: boolean;
  isRepeatAddModalOpen: boolean;
  accountToAdd: AccountFormSuccessResult | null;
  actions: AccountsAction;
}

interface AccountsAction {
  setAddModalOpen: (isOpen: boolean) => void;
  setRepeatAddModalOpen: (isOpen: boolean) => void;
  setAccountToAdd: (account: AccountFormSuccessResult | null) => void;
}

const useAccountStore = create<AccountsStore>(set => ({
  isAddModalOpen: false,
  isRepeatAddModalOpen: false,
  accountToAdd: null,
  actions: {
    setAddModalOpen: isOpen => set({ isAddModalOpen: isOpen }),
    setRepeatAddModalOpen: isOpen => set({ isRepeatAddModalOpen: isOpen }),
    setAccountToAdd: account => set({ accountToAdd: account }),
  },
}));

export const useIsAddModalOpen = () => useAccountStore(state => state.isAddModalOpen);

export const useIsRepeatAddModalOpen = () => useAccountStore(state => state.isRepeatAddModalOpen);
export const useAccountToAdd = () => useAccountStore(state => state.accountToAdd);

export const useAccountsStoreActions = () => useAccountStore(state => state.actions);
