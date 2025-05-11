import { useQuery } from '@tanstack/react-query';

import { OptionType } from '@/components/base/select/option-type';
import { apiFetch } from '@/utils/api-fetch';

import { ACCOUNTS_QUERY_STALE_TIME } from '../accounts/accounts.constants';
import { REPORTS_QUERY_KEY, REPORTS_QUERY_PATH, TRANSACTIONS_LIST_PATH } from './reports.constants';
import { ReportsData } from './reports.types';

type Params = {
  monthYear: string;
};

export default function useReports({ monthYear }: Params) {
  const query = useQuery<ReportsData>({
    queryKey: [REPORTS_QUERY_KEY, monthYear],
    queryFn: () => {
      const url = `${REPORTS_QUERY_PATH}?monthYear=${monthYear}`;
      return apiFetch(url);
    },
    staleTime: ACCOUNTS_QUERY_STALE_TIME,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  return query;
}

export function useReportMonthList() {
  const query = useQuery<OptionType[]>({
    queryKey: [REPORTS_QUERY_KEY, 'monthList'],
    queryFn: () => {
      return apiFetch<{ message: string; data: string[] }>(TRANSACTIONS_LIST_PATH).then(
        ({ data }) => data.map(ym => ({ value: ym, title: ym }))
      );
    },
  });

  return query;
}
