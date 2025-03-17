import { useQuery } from '@tanstack/react-query';

import { apiFetch } from '@/utils/api-fetch';

import { CATEGORIES_QUERY_KEY, CATEGORIES_QUERY_PATH } from './category.constants';
import { CategoryResponse } from './category.types';

export default function useCategories() {
  const query = useQuery<CategoryResponse>({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: () => apiFetch(CATEGORIES_QUERY_PATH),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  return query;
}
