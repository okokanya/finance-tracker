import { useQuery } from '@tanstack/react-query';

import { AccountsResponse } from '@/types/accounts-response';

const ACCOUNTS_QUERY_KEY = ['accounts'] as const;
const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const useAccounts = () => {
  const query = useQuery<AccountsResponse>({
    queryKey: ACCOUNTS_QUERY_KEY,
    queryFn: async () => {
      const userRes = await fetch('/api/users');
      const usersData = await userRes.json();
      const user = usersData[0];

      const res = await fetch(`/api/accounts?userId=${user?.id}`);

      if (!res.ok) {
        throw new Error('Failed to fetch accounts');
      }

      return await res.json();
    },
    staleTime: STALE_TIME,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  return {
    data: query.data,
    error: query.error,
    isLoading: query.isPending,
  };
};
