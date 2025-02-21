import React from 'react';

const logout = (): void => {
  document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  window.location.reload();
};

const LogoutButton: React.FC = () => {
  return (
    <button onClick={logout} className="bg-red-500 text-white p-2 rounded">
      Выйти
    </button>
  );
};

export default LogoutButton;
