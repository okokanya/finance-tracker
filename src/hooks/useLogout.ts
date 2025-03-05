import { useCallback } from 'react';

export const useLogout = () => {
  return useCallback(() => {
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.reload();
  }, []);
};
