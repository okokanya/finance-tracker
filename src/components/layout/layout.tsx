import { FC, PropsWithChildren } from 'react';
import Header from '../header';
import useAuth from '../../hooks/useAuth';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Загрузка...</div>; // Лоадер
  }

  return (
    <div className="flex h-[100vh] flex-col">
      {/* {isAuthenticated && <Header />} */}
      <Header />
      <main className="flex w-full max-w-[1180px] flex-grow columns-4 flex-col items-center gap-5 p-5 md:mx-auto md:my-0 md:columns-12 md:p-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;
