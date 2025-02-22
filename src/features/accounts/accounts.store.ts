import { create } from 'zustand';

interface AccountsStore {
  isAddModalOpen: boolean;
  actions: AccountsAction;
}

interface AccountsAction {
  setAddModalOpen: (isOpen: boolean) => void;
}

const useAccountStore = create<AccountsStore>(set => ({
  isAddModalOpen: false,
  actions: { setAddModalOpen: isOpen => set({ isAddModalOpen: isOpen }) },
}));

export const useIsAddModalOpen = () => useAccountStore(state => state.isAddModalOpen);

export const useAccountsStoreActions = () => useAccountStore(state => state.actions);
