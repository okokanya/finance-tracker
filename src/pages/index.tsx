import { Inter } from 'next/font/google';
import Head from 'next/head';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/header';
import Button from '@/components/button';
import { todoSchema } from '@/models/todos';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const { data: todos, isPending } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await fetch('/api/todos');
      const data = todoSchema.array().parse(await res.json());
      return data;
    },
  });

  return (
    <div className={`${inter.className} items-center min-h-screen flex flex-col justify-between`}>
      <Head>
        <title>Finance Tracker</title>
      </Head>

      <Header/>
      <main>
        <h2 className="text-2xl">Компонент кнопки</h2>
        <div className="flex gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button disabled>Disabled</Button>
        </div>
      </main>

      {isPending ? (
        <p className="text-yellow-400">загрузка...</p>
      ) : (
        <ul>{todos?.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      )}
    </div>
  );
}
