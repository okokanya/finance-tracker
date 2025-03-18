import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useNotificationStore } from '@/components/notification/notification.store';
import { apiFetch } from '@/utils/api-fetch';

import { CATEGORIES_QUERY_KEY, CATEGORIES_QUERY_PATH } from '../category.constants';
import { useCategoriesStore } from '../category.store';
import { CategoryForm } from '../category.types';

export default function useAddCategory() {
  const queryClient = useQueryClient();
  const setIsCreateModalOpen = useCategoriesStore(store => store.setIsCreateModalOpen);
  const show = useNotificationStore(store => store.show);

  return useMutation({
    mutationFn: (fetchBody: CategoryForm) =>
      apiFetch(CATEGORIES_QUERY_PATH, {
        method: 'POST',
        fetchBody,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      setIsCreateModalOpen(false);
    },
    onError: () => {
      show('Произошла ошибка при сохранении');
    },
  });
}
