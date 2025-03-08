import { create } from 'zustand';

import { OptionType } from '@/components/select/option-type';
import {
  AccountFormSuccessResult,
  AccountResponse,
  AddAccountTransactionFormSuccessResult,
} from '@/features/accounts/accounts.types';

interface AccountsStore {
  actions: AccountsAction;

  isAddAccountModalOpen: boolean;
  isRepeatAddAccountModalOpen: boolean;
  accountFormData: AccountFormSuccessResult | null;

  isManageAccountModalOpen: boolean;
  accountToManage: AccountResponse | null;
  isRepeatUpdateAccountModalOpen: boolean;
  isRepeatDeleteAccountModalOpen: boolean;
  isRepeatArchiveAccountModalOpen: boolean;

  isAddAccountTransactionModalOpen: boolean;
  accountToAddTransaction: AccountResponse | null;
  accountsForTransfer: OptionType<string>[] | null;
  allAccountsForTransfer: Map<string, AccountResponse> | null;
  isRepeatAddAccountTransactionModalOpen: boolean;
  addAccountTransactionFormData: AddAccountTransactionFormSuccessResult | null;
}

interface AccountsAction {
  setAddAccountModalOpen: (isOpen: boolean) => void;
  setRepeatAddAccountModalOpen: (isOpen: boolean) => void;
  setAccountFormData: (data: AccountFormSuccessResult | null) => void;

  setManageAccountModalOpen: (isOpen: boolean) => void;
  setAccountToManage: (account: AccountResponse | null) => void;
  setRepeatUpdateAccountModalOpen: (isOpen: boolean) => void;
  setRepeatDeleteAccountModalOpen: (isOpen: boolean) => void;
  setRepeatArchiveAccountModalOpen: (isOpen: boolean) => void;

  setAddAccountTransactionModalOpen: (isOpen: boolean) => void;
  setAccountToAddTransaction: (account: AccountResponse | null) => void;
  setAccountsForTransfer: (accounts: OptionType<string>[] | null) => void;
  setAllAccountsForTransfer: (accounts: Map<string, AccountResponse> | null) => void;
  setRepeatAddAccountTransactionModalOpen: (isOpen: boolean) => void;
  setAddAccountTransactionFormData: (data: AddAccountTransactionFormSuccessResult | null) => void;
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
  isAddAccountTransactionModalOpen: false,
  accountToAddTransaction: null,
  accountsForTransfer: null,
  allAccountsForTransfer: null,
  isRepeatAddAccountTransactionModalOpen: false,
  addAccountTransactionFormData: null,
  actions: {
    setAddAccountModalOpen: isOpen => set({ isAddAccountModalOpen: isOpen }),
    setRepeatAddAccountModalOpen: isOpen => set({ isRepeatAddAccountModalOpen: isOpen }),
    setAccountFormData: data => set({ accountFormData: data }),

    setManageAccountModalOpen: isOpen => set({ isManageAccountModalOpen: isOpen }),
    setAccountToManage: account => set({ accountToManage: account }),
    setRepeatUpdateAccountModalOpen: isOpen => set({ isRepeatUpdateAccountModalOpen: isOpen }),
    setRepeatDeleteAccountModalOpen: isOpen => set({ isRepeatDeleteAccountModalOpen: isOpen }),
    setRepeatArchiveAccountModalOpen: isOpen => set({ isRepeatArchiveAccountModalOpen: isOpen }),

    setAddAccountTransactionModalOpen: isOpen => set({ isAddAccountTransactionModalOpen: isOpen }),
    setAccountToAddTransaction: account => set({ accountToAddTransaction: account }),
    setAccountsForTransfer: accounts => set({ accountsForTransfer: accounts }),
    setAllAccountsForTransfer: accounts => set({ allAccountsForTransfer: accounts }),
    setRepeatAddAccountTransactionModalOpen: isOpen =>
      set({ isRepeatAddAccountTransactionModalOpen: isOpen }),
    setAddAccountTransactionFormData: data => set({ addAccountTransactionFormData: data }),
  },
}));

export const useAccountsStoreActions = () => useAccountStore(state => state.actions);

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

export const useIsAddAccountTransactionModalOpen = () =>
  useAccountStore(state => state.isAddAccountTransactionModalOpen);

export const useAccountToAddTransaction = () =>
  useAccountStore(state => state.accountToAddTransaction);

export const useAccountsForTransfer = () => useAccountStore(state => state.accountsForTransfer);

export const useAllAccountsForTransfer = () =>
  useAccountStore(state => state.allAccountsForTransfer);

export const useAddAccountTransactionFormData = () =>
  useAccountStore(state => state.addAccountTransactionFormData);

export const useIsAddRepeatAccountTransactionModalOpen = () =>
  useAccountStore(state => state.isRepeatAddAccountTransactionModalOpen);
