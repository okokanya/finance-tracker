import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useNotificationStore } from '@/components/notification/notification.store';
import {
  ACCOUNTS_QUERY_KEY,
  TRANSACTIONS_QUERY_PATH,
} from '@/features/accounts/accounts.constants';
import { REPORTS_QUERY_KEY } from '@/features/reports/reports.constants';
import { apiFetch } from '@/utils/api-fetch';

import { CATEGORIES_QUERY_KEY } from '../category.constants';
import { texts } from '../category.texts';
import { TransactionFormData } from '../category.types';

export default function useAddCategoryTransaction() {
  const queryClient = useQueryClient();
  const show = useNotificationStore(store => store.show);

  return useMutation({
    mutationFn: (fetchBody: TransactionFormData) =>
      apiFetch(`api/${TRANSACTIONS_QUERY_PATH}`, {
        method: 'POST',
        fetchBody,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [REPORTS_QUERY_KEY] });
    },
    onError: () => {
      show(texts.savingError);
    },
  });
}
