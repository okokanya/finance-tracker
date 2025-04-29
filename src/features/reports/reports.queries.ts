import { useQuery } from '@tanstack/react-query';

import { apiFetch } from '@/utils/api-fetch';

import { ACCOUNTS_QUERY_STALE_TIME } from '../accounts/accounts.constants';
import { REPORTS_QUERY_KEY, REPORTS_QUERY_PATH } from './reports.constants';
import { ReportsData } from './reports.types';

type Params = {
  month: 'current' | 'prev';
};

export default function useReports({ month }: Params) {
  const query = useQuery<ReportsData>({
    queryKey: [REPORTS_QUERY_KEY, month],
    queryFn: () => {
      const url = `${REPORTS_QUERY_PATH}?month=${month}`;
      return apiFetch(url);
    },
    staleTime: ACCOUNTS_QUERY_STALE_TIME,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  return query;
}
