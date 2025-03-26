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
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-gray-100">
      {pageProps.hideHeader ? null : <Header />}
      <div className="h-full overflow-auto">
        <main className="flex w-full max-w-[1228px] flex-grow columns-4 flex-col items-center gap-4 px-5 md:mx-auto md:my-0 md:columns-12 md:gap-5 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
