import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  LOGOUT_QUERY_KEY,
  PROFILE_QUERY_KEY,
  PROFILE_QUERY_PATH,
  PROFILE_STALE_TIME,
} from '@/features/profile/profile.constants';
import { ProfileUpdateRequest, User } from '@/features/profile/profile.types';
import { apiFetch } from '@/utils/api-fetch';

export const useProfile = (isProfileEnable: boolean) => {
  const queryClient = useQueryClient();

  const query = useQuery<User | null>({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      if (!isProfileEnable) return null;

      const data = await apiFetch<User>(PROFILE_QUERY_PATH);
      queryClient.setQueryData(PROFILE_QUERY_KEY, data);

      return data;
    },
    staleTime: PROFILE_STALE_TIME,
    enabled: isProfileEnable,
  });

  return {
    data: query.data,
    isError: query.isError,
    isPending: query.isPending,
  };
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileUpdateRequest) =>
      apiFetch<User>(PROFILE_QUERY_PATH, {
        method: 'PUT',
        fetchBody: data,
      }),
    onSuccess(data: User) {
      queryClient.setQueryData(PROFILE_QUERY_KEY, data);
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationKey: LOGOUT_QUERY_KEY,
    mutationFn: () => apiFetch('/api/auth/logout'),
  });
};
