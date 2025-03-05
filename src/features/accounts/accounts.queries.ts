import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  ACCOUNT_TRANSACTIONS_QUERY_KEY,
  ACCOUNTS_QUERY_KEY,
  ACCOUNTS_QUERY_PATH,
  ACCOUNTS_QUERY_STALE_TIME,
  TRANSACTIONS_QUERY_PATH,
} from '@/features/accounts/accounts.constants';
import {
  AccountFormSuccessResult,
  AccountsResponse,
  AccountTransaction,
} from '@/features/accounts/accounts.types';
import { apiFetch } from '@/utils/api-fetch';

export const useAccounts = () => {
  const query = useQuery<AccountsResponse>({
    queryKey: ACCOUNTS_QUERY_KEY,
    queryFn: () => apiFetch(ACCOUNTS_QUERY_PATH),
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
    mutationFn: (account: AccountFormSuccessResult) =>
      apiFetch(ACCOUNTS_QUERY_PATH, {
        method: 'POST',
        fetchBody: account,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...account }: AccountFormSuccessResult & { id: string }) =>
      apiFetch(`${ACCOUNTS_QUERY_PATH}/${id}`, {
        method: 'PUT',
        fetchBody: account,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
};

export const useAccountTransactions = (accountId?: string) => {
  const query = useQuery<AccountTransaction[]>({
    queryKey: [ACCOUNT_TRANSACTIONS_QUERY_KEY, accountId],
    queryFn: () => apiFetch(`${ACCOUNTS_QUERY_PATH}/${accountId}/${TRANSACTIONS_QUERY_PATH}`),
    enabled: !!accountId,
    staleTime: ACCOUNTS_QUERY_STALE_TIME,
  });

  return {
    data: query.data,
    isError: query.isError,
    isPending: query.isPending,
    refetch: query.refetch,
  };
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) =>
      apiFetch(`${ACCOUNTS_QUERY_PATH}/${accountId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
};
