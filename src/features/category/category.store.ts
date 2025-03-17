import { create } from 'zustand';

interface CategoriesStore {
  isEditModalOpen: boolean;
  isCreateModalOpen: boolean;
  isEdit: boolean;
  setIsEditModalOpen: (isOpen: boolean) => void;
  setIsCreateModalOpen: (isOpen: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
}

export const useCategoriesStore = create<CategoriesStore>(set => ({
  isEditModalOpen: false,
  isCreateModalOpen: false,
  isEdit: false,
  setIsEditModalOpen: isOpen => set({ isEditModalOpen: isOpen }),
  setIsCreateModalOpen: isOpen => set({ isCreateModalOpen: isOpen }),
  setIsEdit: isEdit => set({ isEdit }),
}));

export const useIsEditModalOpen = () => useCategoriesStore(state => state.isEditModalOpen);
export const useIsCreateModalOpen = () => useCategoriesStore(state => state.isCreateModalOpen);
export const useIsCategoryEdit = () => useCategoriesStore(state => state.isEdit);
