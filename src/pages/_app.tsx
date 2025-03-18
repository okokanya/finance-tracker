import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import ErrorBoundary from '@/components/base/error-boundary';
import Layout from '@/components/base/layout';
import { Notification } from '@/components/notification/notification';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>{`Finance Tracker - ${pageProps.title}`}</title>
        </Head>
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
          <Notification />
        </Layout>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
