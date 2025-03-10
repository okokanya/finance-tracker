import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';

import { apiFetch } from '@/utils/api-fetch';

export const useLogout = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ['logout'],
    mutationFn: () => apiFetch('api/auth/logout'),
    onSuccess: () => {
      router.replace('signin');
    },
  });

  return useCallback(() => {
    mutation.mutate();
  }, [mutation]);
};
