import React from 'react';
import Button from './button';
import { useLogout } from '@/hooks/useLogout';

const LogoutButton: React.FC = () => {
  const logout = useLogout();

  return (
    <Button onClick={logout} className="bg-red-500 text-white p-2 rounded">
      Выйти
    </Button>
  );
};

export default LogoutButton;
