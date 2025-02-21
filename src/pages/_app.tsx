import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Head from 'next/head';

import Layout from '@/components/layout/layout';
type CustomAppProps = AppProps & {
  Component: AppProps['Component'] & {
    title?: string;
  };
};

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: CustomAppProps) {
  return (

    <QueryClientProvider client={queryClient}>
      <Head>
       <title>{`Finance Tracker - {Component.title}`}</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
