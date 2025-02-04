import { FC, PropsWithChildren } from 'react';

import Header from '../header';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex h-[100vh] flex-col">
      <Header />
      <main className="flex w-full max-w-[1180px] flex-grow columns-4 flex-col items-center gap-5 p-5 md:mx-auto md:my-0 md:columns-12 md:p-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;
