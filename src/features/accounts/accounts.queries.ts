import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  ACCOUNTS_QUERY_KEY,
  ACCOUNTS_QUERY_PATH,
  ACCOUNTS_QUERY_STALE_TIME,
} from '@/features/accounts/accounts.constants';
import { AccountFormSuccessResult, AccountsResponse } from '@/features/accounts/accounts.types';
import { User } from '@/models';

// TODO: remove
let user: User;

export const useAccounts = () => {
  const query = useQuery<AccountsResponse>({
    queryKey: ACCOUNTS_QUERY_KEY,
    queryFn: async () => {
      const userRes = await fetch('/api/users');
      const usersData = await userRes.json();
      user = usersData[0];

      const res = await fetch(`${ACCOUNTS_QUERY_PATH}?userId=${user?.id}`);

      if (!res.ok) {
        throw new Error('Failed to fetch accounts');
      }

      return await res.json();
    },
    staleTime: ACCOUNTS_QUERY_STALE_TIME,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  return {
    data: query.data,
    error: query.error,
    isPending: query.isPending,
  };
};

export const useAddAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (account: AccountFormSuccessResult) => {
      const response = await fetch(`${ACCOUNTS_QUERY_PATH}?userId=${user?.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(account),
      });

      if (!response.ok) {
        throw new Error('Failed to add account');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
};
