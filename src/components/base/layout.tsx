import { FC, PropsWithChildren } from 'react';

import Header from '../header';

type Props = PropsWithChildren<{
  pageProps: {
    hideHeader?: boolean;
    title: string;
  };
}>;

const Layout: FC<Props> = ({ children, pageProps }) => {
  return (
    <div className="flex h-[100vh] flex-col overflow-hidden">
      {pageProps.hideHeader ? null : <Header />}
      <div className="h-full overflow-auto bg-gray-100">
        <main className="flex w-full max-w-[1180px] flex-grow columns-4 flex-col items-center gap-5 md:mx-auto md:my-0 md:columns-12 md:p-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
