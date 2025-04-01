import { create } from 'zustand';

import { Category } from '@/models';

interface CategoriesStore {
  isEditModalOpen: boolean;
  isCreateModalOpen: boolean;
  isEdit: boolean;
  selectedCategory: Category | null;
  setIsEditModalOpen: (isOpen: boolean) => void;
  setIsCreateModalOpen: (isOpen: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
  setSelectedCategory: (category: Category | null) => void;
}

export const useCategoriesStore = create<CategoriesStore>(set => ({
  isEditModalOpen: false,
  isCreateModalOpen: false,
  isEdit: false,
  selectedCategory: null,
  setIsEditModalOpen: isOpen => set({ isEditModalOpen: isOpen }),
  setIsCreateModalOpen: isOpen => set({ isCreateModalOpen: isOpen }),
  setIsEdit: isEdit => set({ isEdit }),
  setSelectedCategory: (selectedCategory: Category | null) => set({ selectedCategory }),
}));

export const useIsEditModalOpen = () => useCategoriesStore(state => state.isEditModalOpen);
export const useIsCreateModalOpen = () => useCategoriesStore(state => state.isCreateModalOpen);
export const useIsCategoryEdit = () => useCategoriesStore(state => state.isEdit);
