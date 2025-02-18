import { Inter } from 'next/font/google';
import Head from 'next/head';
import Button from '@/components/button';
import Input from '@/components/input/input';

const inter = Inter({ subsets: ['latin'] });
Home.title = 'Регистрация';


export default function Home() {
  return (
    <div className={`${inter.className} flex min-h-screen flex-col items-center justify-between`}>
      <Head>
        <title>Finance Tracker</title>
      </Head>

      <main>
        <h2 className="text-2xl">Компонент кнопки</h2>
        <div className="flex gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button disabled>Disabled</Button>
        </div>
      </main>
      <div className="mt-2 flex flex-col gap-2">
        <Input />
        <Input placeholder="Placeholder" />
        <Input errorText="Error text" />
        <Input disabled value="Disabled" />
      </div>
    </div>
  );
}
