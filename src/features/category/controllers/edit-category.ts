import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useNotificationStore } from '@/components/notification/notification.store';
import { apiFetch } from '@/utils/api-fetch';

import { CATEGORIES_QUERY_KEY, CATEGORIES_QUERY_PATH } from '../category.constants';
import { useCategoriesStore } from '../category.store';
import { CategoryForm } from '../category.types';

type MutationParams = {
  id: string;
  fetchBody: CategoryForm;
};

export function useEditCategory() {
  const queryClient = useQueryClient();
  const isModalOpen = useCategoriesStore(store => store.setIsEditModalOpen);
  const show = useNotificationStore(store => store.show);

  return useMutation({
    mutationFn: ({ id, fetchBody }: MutationParams) =>
      apiFetch(`${CATEGORIES_QUERY_PATH}/${id}`, {
        method: 'PUT',
        fetchBody,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      isModalOpen(false);
    },
    onError: () => {
      show('Произошла ошибка при обновлении категории');
    },
  });
}
