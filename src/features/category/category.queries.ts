import { useQuery } from '@tanstack/react-query';

import { CategoryType } from '@/models';
import { apiFetch } from '@/utils/api-fetch';

import { ACCOUNTS_QUERY_STALE_TIME } from '../accounts/accounts.constants';
import { CATEGORIES_QUERY_KEY, CATEGORIES_QUERY_PATH, Period } from './category.constants';
import { CategoryResponse } from './category.types';

type QueryFnParams = {
  type?: CategoryType;
  period?: Period;
};

export default function useCategories({ type, period }: QueryFnParams = {}) {
  const query = useQuery<CategoryResponse>({
    queryKey: [CATEGORIES_QUERY_KEY, type, period],
    queryFn: () => {
      const query = new URLSearchParams();
      if (type) {
        query.append('type', type);
      }
      if (period) {
        query.append('period', period);
      }

      const url = `${CATEGORIES_QUERY_PATH}${query.toString().length ? `?${query.toString()}` : ''}`;

      return apiFetch(url);
    },
    staleTime: ACCOUNTS_QUERY_STALE_TIME,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  return query;
}
