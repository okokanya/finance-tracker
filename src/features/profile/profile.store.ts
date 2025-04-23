import { create } from 'zustand';

interface ProfileStore {
  actions: ProfileAction;
  isProfileEnable: boolean;
}

interface ProfileAction {
  setIsProfileEnable: (isEnable: boolean) => void;
}

const useProfiletore = create<ProfileStore>(set => ({
  isProfileEnable: false,
  actions: {
    setIsProfileEnable: isEnable => set({ isProfileEnable: isEnable }),
  },
}));

export const useProfileStoreActions = () => useProfiletore(state => state.actions);

export const useIsProfileEnable = () => useProfiletore(state => state.isProfileEnable);
