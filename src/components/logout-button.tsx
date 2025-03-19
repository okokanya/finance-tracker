import React from 'react';

import { useLogout } from '@/hooks/use-logout';

import Button from './base/button';

const LogoutButton: React.FC = () => {
  const logout = useLogout();

  return (
    <Button onClick={logout} className="rounded bg-red-500 p-2 text-white">
      Выйти
    </Button>
  );
};

export default LogoutButton;
